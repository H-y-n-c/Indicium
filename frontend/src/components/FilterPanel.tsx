'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { Region } from '@/lib/api';

interface FilterPanelProps {
  groupBy: string;
  onGroupByChange: (value: string) => void;
  estado?: string;
  onEstadoChange: (value: string) => void;
  municipio?: string;
  onMunicipioChange: (value: string) => void;
  regions: Region[];
}

export function FilterPanel({
  groupBy,
  onGroupByChange,
  estado,
  onEstadoChange,
  municipio,
  onMunicipioChange,
  regions,
}: FilterPanelProps) {
  const selectedRegion = regions.find((r) => r.estado === estado);
  const municipios = selectedRegion?.municipios || [];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={groupBy} onValueChange={onGroupByChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select value={estado} onValueChange={onEstadoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.estado} value={region.estado}>
                    {region.estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Município</label>
            <Select
              value={municipio}
              onValueChange={onMunicipioChange}
              disabled={!estado || estado === 'all'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os municípios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {municipios.map((mun) => (
                  <SelectItem key={mun} value={mun}>
                    {mun}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
