// Utility functions for betting calculations and odds conversions

export interface OddsFormats {
  american: number;
  decimal: number;
  fractional: string;
  impliedProbability: number;
}

/**
 * Convert American odds to decimal odds
 */
export function americanToDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return (americanOdds / 100) + 1;
  } else {
    return (100 / Math.abs(americanOdds)) + 1;
  }
}

/**
 * Convert American odds to fractional odds
 */
export function americanToFractional(americanOdds: number): string {
  if (americanOdds > 0) {
    return `${americanOdds}/100`;
  } else {
    const absOdds = Math.abs(americanOdds);
    return `100/${absOdds}`;
  }
}

/**
 * Convert American odds to implied probability
 */
export function americanToImpliedProbability(americanOdds: number): number {
  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  } else {
    const absOdds = Math.abs(americanOdds);
    return absOdds / (absOdds + 100);
  }
}

/**
 * Convert all odds formats and calculate implied probability
 */
export function convertOdds(americanOdds: number): OddsFormats {
  return {
    american: americanOdds,
    decimal: americanToDecimal(americanOdds),
    fractional: americanToFractional(americanOdds),
    impliedProbability: americanToImpliedProbability(americanOdds)
  };
}

/**
 * Calculate the vig (bookmaker margin) from two-way betting odds
 */
export function calculateVig(odds1: number, odds2: number): number {
  const prob1 = americanToImpliedProbability(odds1);
  const prob2 = americanToImpliedProbability(odds2);
  return (prob1 + prob2 - 1) * 100;
}

/**
 * Calculate fair odds (no vig) from American odds
 */
export function calculateFairOdds(odds1: number, odds2: number): { odds1: number; odds2: number } {
  const prob1 = americanToImpliedProbability(odds1);
  const prob2 = americanToImpliedProbability(odds2);
  const totalProb = prob1 + prob2;
  
  const fairProb1 = prob1 / totalProb;
  const fairProb2 = prob2 / totalProb;
  
  // Convert back to American odds
  const fairOdds1 = fairProb1 > 0.5 
    ? -Math.round((fairProb1 / (1 - fairProb1)) * 100)
    : Math.round(((1 - fairProb1) / fairProb1) * 100);
    
  const fairOdds2 = fairProb2 > 0.5
    ? -Math.round((fairProb2 / (1 - fairProb2)) * 100)
    : Math.round(((1 - fairProb2) / fairProb2) * 100);
  
  return { odds1: fairOdds1, odds2: fairOdds2 };
}

/**
 * Determine if a bet has positive expected value
 */
export function hasPositiveEV(bookmakerOdds: number, fairOdds: number): boolean {
  const bookmakerProb = americanToImpliedProbability(bookmakerOdds);
  const fairProb = americanToImpliedProbability(fairOdds);
  return fairProb > bookmakerProb;
}

/**
 * Calculate expected value percentage
 */
export function calculateEV(bookmakerOdds: number, fairOdds: number): number {
  const fairProb = americanToImpliedProbability(fairOdds);
  const decimal = americanToDecimal(bookmakerOdds);
  
  return (fairProb * decimal - 1) * 100;
}

/**
 * Format odds for display
 */
export function formatOdds(odds: number, format: 'american' | 'decimal' | 'fractional' = 'american'): string {
  switch (format) {
    case 'american':
      return odds > 0 ? `+${odds}` : `${odds}`;
    case 'decimal':
      return americanToDecimal(odds).toFixed(2);
    case 'fractional':
      return americanToFractional(odds);
    default:
      return odds.toString();
  }
}

/**
 * Format percentage with appropriate decimal places
 */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

/**
 * Get color class for EV indicator
 */
export function getEVColorClass(ev: number): string {
  if (ev > 5) return 'text-green-600 bg-green-50';
  if (ev > 0) return 'text-green-500 bg-green-25';
  if (ev > -5) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}