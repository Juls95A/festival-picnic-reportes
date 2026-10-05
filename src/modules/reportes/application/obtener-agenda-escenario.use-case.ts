import { ReporteNoEncontradoError } from "../domain/reportes.errors.ts";
import type { ShowAgenda } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

export class ObtenerAgendaEscenarioUseCase {
  constructor(private readonly repository: ReportesRepository) {}

  async execute(escenarioId: number, diaId: number): Promise<ShowAgenda[]> {
    if (!(await this.repository.existeEscenario(escenarioId))) {
      throw new ReporteNoEncontradoError(`El escenario ${escenarioId} no existe`);
    }
    return this.repository.obtenerAgendaEscenario(escenarioId, diaId);
  }
}
