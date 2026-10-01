import type { OcupacionDia, VentaPorDia } from "./reportes.entities.ts";

// Puerto de solo lectura: los casos de uso dependen de esta interfaz, no del ORM.
export interface ReportesRepository {
  /** Todos los días (incluso sin ventas), ordenados por fecha, contando solo boletas ACTIVE. */
  obtenerVentasPorDia(): Promise<VentaPorDia[]>;

  /** Ocupación de un día contando solo boletas ACTIVE; null si el día no existe. */
  obtenerOcupacionDia(diaId: number): Promise<OcupacionDia | null>;
}
