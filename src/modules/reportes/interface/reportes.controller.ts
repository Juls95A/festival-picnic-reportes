import type { NextFunction, Request, Response } from "express";
import type { ObtenerOcupacionDiaUseCase } from "../application/obtener-ocupacion-dia.use-case.ts";
import type { ObtenerVentasPorDiaUseCase } from "../application/obtener-ventas-por-dia.use-case.ts";
import { ReporteValidacionError } from "../domain/reportes.errors.ts";

const parsearIdPositivo = (valor: string | string[] | undefined, campo: string): number => {
  if (typeof valor !== "string" || !/^\d+$/.test(valor) || Number(valor) < 1) {
    throw new ReporteValidacionError(`${campo} debe ser un entero positivo`);
  }
  return Number(valor);
};

export class ReportesController {
  constructor(
    private readonly obtenerVentasPorDia: ObtenerVentasPorDiaUseCase,
    private readonly obtenerOcupacionDia: ObtenerOcupacionDiaUseCase,
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
}
