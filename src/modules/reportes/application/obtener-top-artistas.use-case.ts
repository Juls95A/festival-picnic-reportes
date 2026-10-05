import { ReporteValidacionError } from "../domain/reportes.errors.ts";
import type { ArtistaTop } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";
import { redondear2 } from "./reportes.redondeo.ts";

export const TOP_ARTISTAS_LIMIT_MIN = 1;
export const TOP_ARTISTAS_LIMIT_MAX = 10;
export const TOP_ARTISTAS_LIMIT_DEFECTO = 5;

export class ObtenerTopArtistasUseCase {
  constructor(private readonly repository: ReportesRepository) {}

  async execute(limit: number = TOP_ARTISTAS_LIMIT_DEFECTO): Promise<ArtistaTop[]> {
    if (!Number.isInteger(limit) || limit < TOP_ARTISTAS_LIMIT_MIN || limit > TOP_ARTISTAS_LIMIT_MAX) {
      throw new ReporteValidacionError(
        `limit debe ser un entero entre ${TOP_ARTISTAS_LIMIT_MIN} y ${TOP_ARTISTAS_LIMIT_MAX}`,
      );
    }

    const resumenes = await this.repository.obtenerResumenResenasPorArtista();

    return resumenes
      .filter((r) => r.resenas > 0)
      .map((r) => ({
        artista_id: r.artista_id,
        nombre: r.nombre,
        promedio: redondear2(r.suma_puntajes / r.resenas),
        resenas: r.resenas,
      }))
      // Orden del contrato: promedio desc → número de reseñas desc → nombre asc.
      .sort(
        (a, b) =>
          b.promedio - a.promedio ||
          b.resenas - a.resenas ||
          a.nombre.localeCompare(b.nombre, "es"),
      )
      .slice(0, limit);
  }
}
