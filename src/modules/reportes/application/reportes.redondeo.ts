// Promedios y porcentajes se redondean a 2 decimales y se devuelven como número (contrato de Reportes).
export const redondear2 = (valor: number): number => Math.round((valor + Number.EPSILON) * 100) / 100;
