export type CarbonFootprintComputable =
  | {
      emissionCO2eInKgPerUnit: number;
      unit: string;
      quantity: number;
    }
  | never;
