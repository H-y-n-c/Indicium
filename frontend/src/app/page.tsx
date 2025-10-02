'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { CasesChart } from '@/components/CasesChart';
import { FilterPanel } from '@/components/FilterPanel';
import { api, type DashboardMetrics, type CaseData, type Region } from '@/lib/api';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [groupBy, setGroupBy] = useState('monthly');
  const [estado, setEstado] = useState<string>('all');
  const [municipio, setMunicipio] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [groupBy, estado, municipio]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {
        groupBy,
        estado: estado === 'all' ? undefined : estado,
        municipio: municipio === 'all' ? undefined : municipio,
      };

      const [metricsData, casesData, regionsData] = await Promise.all([
        api.getMetrics(filterParams),
        api.getCases(filterParams),
        regions.length > 0 ? Promise.resolve(regions) : api.getRegions(),
      ]);

      setMetrics(metricsData);
      setCases(casesData.data);
      if (regions.length === 0) setRegions(regionsData);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Sistema de Monitoramento SRAG
              </h1>
              <p className="text-sm text-gray-600">
                Síndrome Respiratória Aguda Grave - Dados e Análises
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Métricas Principais</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg animate-pulse" />
              ))}
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Taxa de Aumento de Casos"
                value={metrics.caseRate.value}
                description="Variação percentual de casos nos últimos 30 dias comparado ao período anterior"
                trend={metrics.caseRate.value > 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="Taxa de Mortalidade"
                value={metrics.mortalityRate.value}
                description="Percentual de óbitos em relação ao total de casos registrados"
                trend={metrics.mortalityRate.value > 5 ? 'up' : 'neutral'}
              />
              <MetricCard
                title="Taxa de Ocupação UTI"
                value={metrics.icuRate.value}
                description="Percentual de casos hospitalizados que necessitaram de UTI"
                trend={metrics.icuRate.value > 50 ? 'up' : 'neutral'}
              />
              <MetricCard
                title="Taxa de Vacinação"
                value={metrics.vaccinationRate.value}
                description="Percentual de casos que receberam pelo menos uma dose da vacina"
                trend={metrics.vaccinationRate.value > 70 ? 'down' : 'up'}
              />
            </div>
          ) : null}
        </section>

        {/* Filters */}
        <section className="mb-6">
          <FilterPanel
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            estado={estado}
            onEstadoChange={(value) => {
              setEstado(value);
              setMunicipio('all');
            }}
            municipio={municipio}
            onMunicipioChange={setMunicipio}
            regions={regions}
          />
        </section>

        {/* Chart Section */}
        <section>
          {loading ? (
            <div className="h-[500px] bg-white rounded-lg animate-pulse" />
          ) : (
            <CasesChart data={cases} groupBy={groupBy} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            Dados: OpenDataSUS | Sistema desenvolvido para Indicium HealthCare Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
