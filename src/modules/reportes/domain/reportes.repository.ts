import type { AforoDia, VentaPorDia } from "./reportes.entities.ts";

// Puerto de solo lectura: los casos de uso dependen de esta interfaz, no del ORM.
export interface ReportesRepository {
  /** Todos los días (incluso sin ventas), ordenados por fecha, contando solo boletas ACTIVE. */
  obtenerVentasPorDia(): Promise<VentaPorDia[]>;

  /** Aforo del día y boletas ACTIVE vendidas para ese día; null si el día no existe. */
  obtenerAforoDia(diaId: number): Promise<AforoDia | null>;
}
