// 1. Para el gráfico lineal (Evolución en el tiempo)
export type ReportFilter = 'today' | 'week' | 'month' | 'year';

// Lo que sale hacia Flutter
export interface SalesChartData {
  filter: ReportFilter;
  labels: string[]; // Eje X: ["00:00", "01:00"] o ["Lun", "Mar"]
  values: number[]; // Eje Y: [100, 0, 50...]
  total: number;    // Un total general es útil para mostrar arriba del gráfico
}

// Lo que viene de la BD (Simplificado)
export interface SaleRecord {
  createdAt: Date;
  amount: number;
}