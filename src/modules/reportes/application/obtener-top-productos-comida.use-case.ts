
import type { ProductoComidaTop } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

export class ObtenerTopProductosComidaUseCase {
  constructor(private readonly repository: ReportesRepository) {}

  async execute(): Promise<ProductoComidaTop[]> {
    return this.repository.obtenerTopProductosComida();
  }
}
