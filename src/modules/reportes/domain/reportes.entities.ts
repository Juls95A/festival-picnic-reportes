// Forma de cada reporte según contratos/12-reportes.md (bloque ventas y ocupación).

export interface VentaPorDia {
  dia_id: number;
  nombre: string;
  fecha: string; // YYYY-MM-DD
  boletas: number;
  ingresos: number;
}

export interface OcupacionDia {
  dia_id: number;
  aforo: number;
  vendidas: number;
  porcentaje: number; // redondeado a 2 decimales
}
