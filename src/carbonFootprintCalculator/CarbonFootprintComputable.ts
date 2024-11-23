export type CarbonFootprintComputable = {
  emissionCO2eInKgPerUnit: number;
  unit: 'kg';
  quantity: number;
} | never;
