import { countriesPart1 } from './countries_part1';
import { countriesPart2 } from './countries_part2';

export interface Country {
  name: string;
  code: string;
  flag: string;
  min: number;
  max: number;
}

export const countries: Country[] = [
  ...countriesPart1,
  ...countriesPart2
];
