import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetCasesDto, GetMetricsDto } from './dto/srag.dto';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

@Injectable()
export class SragService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(query: GetMetricsDto) {
    const { period = 'monthly', estado, municipio } = query;

    const latestMetrics = await this.prisma.dashboardMetric.findMany({
      where: {
        period,
        region: estado || municipio || null,
      },
      orderBy: { referenceDate: 'desc' },
      take: 4,
    });

    // If no pre-calculated metrics, calculate on the fly
    if (latestMetrics.length === 0) {
      return this.calculateLiveMetrics(estado, municipio);
    }

    const metricsMap = latestMetrics.reduce((acc, metric) => {
      acc[metric.metricType] = {
        value: metric.value,
        period: metric.period,
        referenceDate: metric.referenceDate,
      };
      return acc;
    }, {});

    return {
      caseRate: metricsMap['case_rate'] || { value: 0 },
      mortalityRate: metricsMap['mortality_rate'] || { value: 0 },
      icuRate: metricsMap['icu_rate'] || { value: 0 },
      vaccinationRate: metricsMap['vaccination_rate'] || { value: 0 },
    };
  }

  async calculateLiveMetrics(estado?: string, municipio?: string) {
    const where: any = {};
    if (estado) where.estado = estado;
    if (municipio) where.municipio = municipio;

    const totalCases = await this.prisma.sragCase.count({ where });

    const deaths = await this.prisma.sragCase.count({
      where: { ...where, evolucaoCaso: 'Óbito' },
    });

    const hospitalized = await this.prisma.sragCase.count({
      where: { ...where, hospitalizado: true },
    });

    const inICU = await this.prisma.sragCase.count({
      where: { ...where, utiStatus: true },
    });

    const vaccinated = await this.prisma.sragCase.count({
      where: { ...where, vacinado: true },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCases = await this.prisma.sragCase.count({
      where: { ...where, dataNotificacao: { gte: thirtyDaysAgo } },
    });

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousCases = await this.prisma.sragCase.count({
      where: {
        ...where,
        dataNotificacao: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    });

    const caseRate = previousCases > 0 ? ((recentCases - previousCases) / previousCases) * 100 : 0;
    const mortalityRate = totalCases > 0 ? (deaths / totalCases) * 100 : 0;
    const icuRate = hospitalized > 0 ? (inICU / hospitalized) * 100 : 0;
    const vaccinationRate = totalCases > 0 ? (vaccinated / totalCases) * 100 : 0;

    return {
      caseRate: { value: caseRate },
      mortalityRate: { value: mortalityRate },
      icuRate: { value: icuRate },
      vaccinationRate: { value: vaccinationRate },
    };
  }

  async getCases(query: GetCasesDto) {
    const { period = 'monthly', estado, municipio, startDate, endDate, groupBy = 'monthly' } = query;

    const where: any = {};

    if (estado) where.estado = estado;
    if (municipio) where.municipio = municipio;

    if (startDate && endDate) {
      where.dataNotificacao = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else {
      // Default to last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      where.dataNotificacao = { gte: oneYearAgo };
    }

    const cases = await this.prisma.sragCase.findMany({
      where,
      select: {
        dataNotificacao: true,
        estado: true,
        municipio: true,
      },
      orderBy: { dataNotificacao: 'asc' },
    });

    // Group cases by period
    const grouped = this.groupCasesByPeriod(cases, groupBy);

    return {
      data: grouped,
      total: cases.length,
    };
  }

  private groupCasesByPeriod(cases: any[], groupBy: string) {
    const groups = new Map<string, number>();

    cases.forEach((caso) => {
      const date = new Date(caso.dataNotificacao);
      let key: string;

      if (groupBy === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (groupBy === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      } else {
        // yearly
        key = String(date.getFullYear()); // YYYY
      }

      groups.set(key, (groups.get(key) || 0) + 1);
    });

    return Array.from(groups.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getRegions() {
    const estados = await this.prisma.sragCase.findMany({
      distinct: ['estado'],
      select: { estado: true },
      orderBy: { estado: 'asc' },
    });

    const regionsWithMunicipios = await Promise.all(
      estados.map(async ({ estado }) => {
        const municipios = await this.prisma.sragCase.findMany({
          where: { estado },
          distinct: ['municipio'],
          select: { municipio: true },
          orderBy: { municipio: 'asc' },
        });

        return {
          estado,
          municipios: municipios.map((m) => m.municipio),
        };
      }),
    );

    return regionsWithMunicipios;
  }
}
