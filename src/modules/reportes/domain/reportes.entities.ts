// Forma de cada reporte según contratos/12-reportes.md (bloque ventas y ocupación).

export interface VentaPorDia {
  dia_id: number;
  nombre: string;
  fecha: string; // YYYY-MM-DD
  boletas: number;
  ingresos: number;
}

// Datos crudos de un día que entrega el repositorio; el porcentaje lo calcula el caso de uso.
export interface AforoDia {
  dia_id: number;
  aforo: number;
  vendidas: number;
}

export interface OcupacionDia extends AforoDia {
  porcentaje: number; // redondeado a 2 decimales
}
