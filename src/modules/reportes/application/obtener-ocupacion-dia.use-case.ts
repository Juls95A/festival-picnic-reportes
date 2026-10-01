import { ReporteNoEncontradoError } from "../domain/reportes.errors.ts";
import type { OcupacionDia } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

// Porcentajes redondeados a 2 decimales y devueltos como número (contrato de Reportes).
const redondear2 = (valor: number): number => Math.round((valor + Number.EPSILON) * 100) / 100;

export class ObtenerOcupacionDiaUseCase {
  constructor(private readonly repository: ReportesRepository) {}

  async execute(diaId: number): Promise<OcupacionDia> {
    const dia = await this.repository.obtenerAforoDia(diaId);
    if (!dia) throw new ReporteNoEncontradoError(`El día ${diaId} no existe`);

    const porcentaje = dia.aforo > 0 ? redondear2((dia.vendidas / dia.aforo) * 100) : 0;
    return { ...dia, porcentaje };
  }
}
