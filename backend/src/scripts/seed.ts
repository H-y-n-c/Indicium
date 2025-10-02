import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import axios from 'axios';

const prisma = new PrismaClient();

interface SragRawData {
  DT_NOTIFIC?: string;
  DT_SIN_PRI?: string;
  SG_UF?: string;
  ID_MUNICIP?: string;
  NU_IDADE_N?: string;
  CS_SEXO?: string;
  FEBRE?: string;
  TOSSE?: string;
  DISPNEIA?: string;
  SATURACAO?: string;
  HOSPITAL?: string;
  DT_INTERNA?: string;
  UTI?: string;
  DT_ENTUTI?: string;
  VACINA?: string;
  DOSE_1_COV?: string;
  DOSE_2_COV?: string;
  DOSE_REF?: string;
  EVOLUCAO?: string;
  DT_EVOLUCA?: string;
}

async function parseCsvFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  return new Date(`${year}-${month}-${day}`);
}

function parseBoolean(value: string | undefined): boolean | null {
  if (!value || value === '9') return null;
  return value === '1';
}

async function transformAndImportData(rawData: SragRawData[]) {
  console.log(`📊 Transforming and importing ${rawData.length} records...`);

  const batchSize = 1000;
  let imported = 0;

  for (let i = 0; i < rawData.length; i += batchSize) {
    const batch = rawData.slice(i, i + batchSize);

    const transformedBatch = batch
      .map((row) => {
        const dataNotificacao = parseDate(row.DT_NOTIFIC);
        if (!dataNotificacao || !row.SG_UF) return null;

        const doses =
          (parseBoolean(row.DOSE_1_COV) ? 1 : 0) +
          (parseBoolean(row.DOSE_2_COV) ? 1 : 0) +
          (parseBoolean(row.DOSE_REF) ? 1 : 0);

        return {
          dataNotificacao,
          dataInicioSint: parseDate(row.DT_SIN_PRI),
          estado: row.SG_UF,
          municipio: row.ID_MUNICIP || 'Desconhecido',
          idadePaciente: row.NU_IDADE_N ? parseInt(row.NU_IDADE_N) : null,
          sexoPaciente: row.CS_SEXO === 'M' ? 'M' : row.CS_SEXO === 'F' ? 'F' : null,
          febre: parseBoolean(row.FEBRE),
          tosse: parseBoolean(row.TOSSE),
          dispneia: parseBoolean(row.DISPNEIA),
          saturacao: parseBoolean(row.SATURACAO),
          hospitalizado: parseBoolean(row.HOSPITAL),
          dataInternacao: parseDate(row.DT_INTERNA),
          utiStatus: parseBoolean(row.UTI),
          dataEntradaUti: parseDate(row.DT_ENTUTI),
          vacinado: parseBoolean(row.VACINA),
          dosesVacina: doses > 0 ? doses : null,
          evolucaoCaso: row.EVOLUCAO === '1' ? 'Cura' : row.EVOLUCAO === '2' ? 'Óbito' : null,
          dataEvolucao: parseDate(row.DT_EVOLUCA),
        };
      })
      .filter((row) => row !== null);

    if (transformedBatch.length > 0) {
      await prisma.sragCase.createMany({
        data: transformedBatch,
        skipDuplicates: true,
      });
      imported += transformedBatch.length;
      console.log(`✅ Imported ${imported} / ${rawData.length} records`);
    }
  }

  console.log(`🎉 Successfully imported ${imported} records`);
}

async function calculateMetrics() {
  console.log('📈 Calculating dashboard metrics...');

  // Get date range
  const cases = await prisma.sragCase.findMany({
    select: { dataNotificacao: true },
    orderBy: { dataNotificacao: 'desc' },
  });

  if (cases.length === 0) {
    console.log('⚠️  No cases found to calculate metrics');
    return;
  }

  const latestDate = cases[0].dataNotificacao;
  const thirtyDaysAgo = new Date(latestDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Case rate (last 30 days)
  const recentCases = await prisma.sragCase.count({
    where: {
      dataNotificacao: { gte: thirtyDaysAgo },
    },
  });

  const previousPeriodStart = new Date(thirtyDaysAgo);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

  const previousCases = await prisma.sragCase.count({
    where: {
      dataNotificacao: {
        gte: previousPeriodStart,
        lt: thirtyDaysAgo,
      },
    },
  });

  const caseRate = previousCases > 0 ? ((recentCases - previousCases) / previousCases) * 100 : 0;

  // Mortality rate
  const totalCases = await prisma.sragCase.count();
  const deaths = await prisma.sragCase.count({
    where: { evolucaoCaso: 'Óbito' },
  });
  const mortalityRate = totalCases > 0 ? (deaths / totalCases) * 100 : 0;

  // ICU occupation rate
  const hospitalized = await prisma.sragCase.count({
    where: { hospitalizado: true },
  });
  const inICU = await prisma.sragCase.count({
    where: { utiStatus: true },
  });
  const icuRate = hospitalized > 0 ? (inICU / hospitalized) * 100 : 0;

  // Vaccination rate
  const vaccinated = await prisma.sragCase.count({
    where: { vacinado: true },
  });
  const vaccinationRate = totalCases > 0 ? (vaccinated / totalCases) * 100 : 0;

  // Save metrics
  await prisma.dashboardMetric.createMany({
    data: [
      {
        metricType: 'case_rate',
        value: caseRate,
        period: 'monthly',
        referenceDate: latestDate,
      },
      {
        metricType: 'mortality_rate',
        value: mortalityRate,
        period: 'monthly',
        referenceDate: latestDate,
      },
      {
        metricType: 'icu_rate',
        value: icuRate,
        period: 'monthly',
        referenceDate: latestDate,
      },
      {
        metricType: 'vaccination_rate',
        value: vaccinationRate,
        period: 'monthly',
        referenceDate: latestDate,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Metrics calculated successfully');
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if CSV file exists
    const csvPath = path.join(__dirname, '../../data/srag_sample.csv');

    if (!fs.existsSync(csvPath)) {
      console.log('⚠️  Sample CSV not found. Creating sample data...');

      // Create sample data
      const sampleData = [];
      const estados = ['SP', 'RJ', 'MG', 'BA', 'PR', 'RS'];
      const today = new Date();

      for (let i = 0; i < 1000; i++) {
        const daysAgo = Math.floor(Math.random() * 365);
        const dataNotificacao = new Date(today);
        dataNotificacao.setDate(dataNotificacao.getDate() - daysAgo);

        sampleData.push({
          dataNotificacao,
          estado: estados[Math.floor(Math.random() * estados.length)],
          municipio: `Município ${Math.floor(Math.random() * 100)}`,
          idadePaciente: Math.floor(Math.random() * 90) + 1,
          sexoPaciente: Math.random() > 0.5 ? 'M' : 'F',
          febre: Math.random() > 0.3,
          tosse: Math.random() > 0.4,
          dispneia: Math.random() > 0.6,
          saturacao: Math.random() > 0.7,
          hospitalizado: Math.random() > 0.5,
          utiStatus: Math.random() > 0.7,
          vacinado: Math.random() > 0.4,
          dosesVacina: Math.floor(Math.random() * 4),
          evolucaoCaso: Math.random() > 0.85 ? 'Óbito' : 'Cura',
        });
      }

      await prisma.sragCase.createMany({ data: sampleData });
      console.log('✅ Sample data created');
    } else {
      const rawData = await parseCsvFile(csvPath);
      await transformAndImportData(rawData);
    }

    await calculateMetrics();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
