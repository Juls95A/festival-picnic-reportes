import type { NextFunction, Request, Response } from "express";
import type { ObtenerAgendaEscenarioUseCase } from "../application/obtener-agenda-escenario.use-case.ts";
import type { ObtenerOcupacionDiaUseCase } from "../application/obtener-ocupacion-dia.use-case.ts";
import type { ObtenerTopArtistasUseCase } from "../application/obtener-top-artistas.use-case.ts";
import type { ObtenerVentasPorDiaUseCase } from "../application/obtener-ventas-por-dia.use-case.ts";
import { ReporteValidacionError } from "../domain/reportes.errors.ts";

type ValorParametro = Request["query"][string] | Request["params"][string];

const parsearIdPositivo = (valor: ValorParametro, campo: string): number => {
  if (typeof valor !== "string" || !/^\d+$/.test(valor) || Number(valor) < 1) {
    throw new ReporteValidacionError(`${campo} debe ser un entero positivo`);
  }
  return Number(valor);
};

// Parámetro de query obligatorio: si no viene → 400 con mensaje propio; si viene mal → 400.
const parsearIdObligatorio = (valor: ValorParametro, campo: string): number => {
  if (valor === undefined) throw new ReporteValidacionError(`${campo} es obligatorio`);
  return parsearIdPositivo(valor, campo);
};

// Parámetro de query opcional entero: undefined si no viene; el rango lo valida el caso de uso.
const parsearEnteroOpcional = (valor: ValorParametro, campo: string): number | undefined => {
  if (valor === undefined) return undefined;
  if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
    throw new ReporteValidacionError(`${campo} debe ser un número entero`);
  }
  return Number(valor);
};

export class ReportesController {
  constructor(
    private readonly obtenerVentasPorDia: ObtenerVentasPorDiaUseCase,
    private readonly obtenerOcupacionDia: ObtenerOcupacionDiaUseCase,
    private readonly obtenerTopArtistas: ObtenerTopArtistasUseCase,
    private readonly obtenerAgendaEscenario: ObtenerAgendaEscenarioUseCase,
  ) {}

  ventasPorDia = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: await this.obtenerVentasPorDia.execute() });
    } catch (error) {
      next(error);
    }
  };

  ocupacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const diaId = parsearIdPositivo(req.params.diaId, "diaId");
      res.status(200).json({ data: await this.obtenerOcupacionDia.execute(diaId) });
    } catch (error) {
      next(error);
    }
  };

  topArtistas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parsearEnteroOpcional(req.query.limit, "limit");
      res.status(200).json({ data: await this.obtenerTopArtistas.execute(limit) });
    } catch (error) {
      next(error);
    }
  };

  agendaEscenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Orden de CONVENCIONES §5: primero todos los 400, después el 404 del escenario.
      const escenarioId = parsearIdPositivo(req.params.escenarioId, "escenarioId");
      const diaId = parsearIdObligatorio(req.query.dia_id, "dia_id");
      res.status(200).json({ data: await this.obtenerAgendaEscenario.execute(escenarioId, diaId) });
    } catch (error) {
      next(error);
    }
  };
}
