import type {AforoDia,ResumenResenasArtista,ShowAgenda,VentaPorDia} from "./reportes.entities.ts";

// Puerto de solo lectura: los casos de uso dependen de esta interfaz, no del ORM.
export interface ReportesRepository {
  /** Todos los días (incluso sin ventas), ordenados por fecha, contando solo boletas ACTIVE. */
  obtenerVentasPorDia(): Promise<VentaPorDia[]>;


  /** Aforo del día y boletas ACTIVE vendidas para ese día; null si el día no existe. */
  obtenerAforoDia(diaId: number): Promise<AforoDia | null>;


  /** Suma de puntajes y número de reseñas ACTIVE (de shows ACTIVE) por artista; solo artistas con al menos una. */
  obtenerResumenResenasPorArtista(): Promise<ResumenResenasArtista[]>;


  /** true si el escenario existe. */
  existeEscenario(escenarioId: number): Promise<boolean>;


  /** Shows ACTIVE del escenario en ese día, con el nombre del artista, ordenados por hora_inicio. */
  obtenerAgendaEscenario(escenarioId: number, diaId: number): Promise<ShowAgenda[]>;
}

