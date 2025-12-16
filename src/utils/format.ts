// src/utils/format.ts
export const formatBRL = (value: number) =>
  (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const getAmenityIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    WI_FI: 'wifi',
    PARKING: 'local_parking',
    POOL: 'pool',
    RESTAURANT: 'restaurant',
    ROOM_SERVICE: 'room_service',
    FITNESS_CENTER: 'fitness_center',
  };
  return iconMap[key] || 'help_outline';
};
