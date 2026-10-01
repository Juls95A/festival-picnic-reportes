import { ReporteNoEncontradoError } from "../domain/reportes.errors.ts";
import type { OcupacionDia } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

export class ObtenerOcupacionDiaUseCase {
  constructor(private readonly repository: ReportesRepository) {}

  async execute(diaId: number): Promise<OcupacionDia> {
    const ocupacion = await this.repository.obtenerOcupacionDia(diaId);
    if (!ocupacion) throw new ReporteNoEncontradoError(`El día ${diaId} no existe`);
    return ocupacion;
  }
}
