// Errores de dominio del módulo Reportes. La capa interface los traduce a códigos HTTP.
export class ReporteValidacionError extends Error {}

export class ReporteNoEncontradoError extends Error {}

export class ReporteNoImplementadoError extends Error {
  constructor(reporte: string) {
    super(`El reporte '${reporte}' todavía no está implementado`);
  }
}
