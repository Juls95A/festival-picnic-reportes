import type { PrismaClient } from "../../../../generated/prisma/client.ts";
import { prisma as prismaClient } from "./prisma.client.ts";
import type {
  AforoDia,
  ResumenResenasArtista,
  ShowAgenda,
  VentaPorDia,
} from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

// Columna @db.Date: Prisma la entrega como Date a medianoche UTC.
const formatearFecha = (fecha: Date): string => fecha.toISOString().slice(0, 10);

const MAX_INT4 = 2_147_483_647;

// Implementación con Prisma (solo lectura sobre dias, boletas, resenas, shows, artistas y escenarios).
export class PrismaReportesRepository implements ReportesRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  async obtenerVentasPorDia(): Promise<VentaPorDia[]> {
    const [dias, ventas] = await Promise.all([
      this.prisma.dias.findMany({
        select: { id: true, nombre: true, fecha: true },
        orderBy: [{ fecha: "asc" }, { id: "asc" }],
      }),
      this.prisma.boletas.groupBy({
        by: ["dia_id"],
        where: { state: "ACTIVE" },
        _count: { _all: true },
        _sum: { precio: true },
      }),
    ]);

    const ventasPorDia = new Map(ventas.map((v) => [v.dia_id, v]));

    // Los días sin boletas activas aparecen con 0 boletas y 0 ingresos.
    return dias.map((dia) => {
      const venta = ventasPorDia.get(dia.id);
      return {
        dia_id: dia.id,
        nombre: dia.nombre,
        fecha: formatearFecha(dia.fecha),
        boletas: venta?._count._all ?? 0,
        ingresos: venta?._sum.precio ?? 0,
      };
    });
  }

  async obtenerAforoDia(diaId: number): Promise<AforoDia | null> {
    // dias.id es INTEGER: un id mayor no puede existir (y Prisma fallaría al enviarlo).
    if (diaId > MAX_INT4) return null;

    const [dia, vendidas] = await Promise.all([
      this.prisma.dias.findUnique({ where: { id: diaId }, select: { id: true, aforo: true } }),
      this.prisma.boletas.count({ where: { dia_id: diaId, state: "ACTIVE" } }),
    ]);
    if (!dia) return null;

    return { dia_id: dia.id, aforo: dia.aforo, vendidas };
  }

  async obtenerResumenResenasPorArtista(): Promise<ResumenResenasArtista[]> {
    // Solo reseñas ACTIVE de shows ACTIVE (regla del contrato: solo se cuenta lo ACTIVE).
    const resenas = await this.prisma.resenas.findMany({
      where: { state: "ACTIVE", shows: { state: "ACTIVE" } },
      select: {
        puntaje: true,
        shows: { select: { artista_id: true, artistas: { select: { nombre: true } } } },
      },
    });

    const porArtista = new Map<number, ResumenResenasArtista>();
    for (const resena of resenas) {
      const artistaId = resena.shows.artista_id;
      const actual = porArtista.get(artistaId) ?? {
        artista_id: artistaId,
        nombre: resena.shows.artistas.nombre,
        suma_puntajes: 0,
        resenas: 0,
      };
      actual.suma_puntajes += resena.puntaje;
      actual.resenas += 1;
      porArtista.set(artistaId, actual);
    }
    return [...porArtista.values()];
  }

  async existeEscenario(escenarioId: number): Promise<boolean> {
    if (escenarioId > MAX_INT4) return false;
    const escenario = await this.prisma.escenarios.findUnique({
      where: { id: escenarioId },
      select: { id: true },
    });
    return escenario !== null;
  }

  async obtenerAgendaEscenario(escenarioId: number, diaId: number): Promise<ShowAgenda[]> {
    // Un dia_id fuera de INTEGER no puede tener shows (y Prisma fallaría al enviarlo).
    if (escenarioId > MAX_INT4 || diaId > MAX_INT4) return [];

    const shows = await this.prisma.shows.findMany({
      where: { escenario_id: escenarioId, dia_id: diaId, state: "ACTIVE" },
      select: { id: true, hora_inicio: true, hora_fin: true, artistas: { select: { nombre: true } } },
      // hora_inicio es HH:MM con cero inicial, así que el orden alfabético es el cronológico.
      orderBy: [{ hora_inicio: "asc" }, { id: "asc" }],
    });

    return shows.map((show) => ({
      show_id: show.id,
      artista: show.artistas.nombre,
      hora_inicio: show.hora_inicio,
      hora_fin: show.hora_fin,
    }));
  }
}
