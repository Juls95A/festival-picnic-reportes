import type { VentaPorDia } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

export class ObtenerVentasPorDiaUseCase {
  constructor(private readonly repository: ReportesRepository) {}

  execute(): Promise<VentaPorDia[]> {
    return this.repository.obtenerVentasPorDia();
  }
}
