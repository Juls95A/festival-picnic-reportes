import type { NextFunction, Request, Response } from "express";
import {
  ReporteNoEncontradoError,
  ReporteNoImplementadoError,
  ReporteValidacionError,
} from "../domain/reportes.errors.ts";

// Traduce los errores del módulo a { error } sin exponer el stack trace.
export const reportesErrorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ReporteValidacionError) return res.status(400).json({ error: error.message });
  if (error instanceof ReporteNoEncontradoError) return res.status(404).json({ error: error.message });
  if (error instanceof ReporteNoImplementadoError) return res.status(501).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
};
