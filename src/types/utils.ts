export type LinearCombination = { [key: string]: bigint };

export type R1CSConstraint = [LinearCombination, LinearCombination, LinearCombination];
