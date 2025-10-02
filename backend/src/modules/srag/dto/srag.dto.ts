import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class GetMetricsDto {
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
  period?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  municipio?: string;
}

export class GetCasesDto {
  @IsOptional()
  @IsEnum(['daily', 'monthly', 'yearly'])
  period?: string;

  @IsOptional()
  @IsEnum(['daily', 'monthly', 'yearly'])
  groupBy?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  municipio?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
