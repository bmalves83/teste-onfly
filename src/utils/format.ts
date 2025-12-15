// src/utils/format.ts
export const formatBRL = (value: number) =>
  (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
