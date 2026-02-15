/**
 * Contrast Checker
 *
 * WCAG 2.1 contrast ratio calculation and accessibility checking.
 */

import { getRelativeLuminance } from './color-utils';

/**
 * WCAG contrast thresholds
 */
export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5, // Normal text
  AA_LARGE: 3.0, // Large text (18pt+ or 14pt+ bold)
  AAA_NORMAL: 7.0, // Enhanced contrast for normal text
  AAA_LARGE: 4.5, // Enhanced contrast for large text
};

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 formula
 *
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(foreground, background) {
  const lum1 = getRelativeLuminance(foreground);
  const lum2 = getRelativeLuminance(background);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check WCAG compliance for a color pair
 *
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 * @returns {Object} Compliance results
 */
export function checkContrast(foreground, background) {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: {
      aa: ratio >= WCAG_THRESHOLDS.AA_NORMAL,
      aaLarge: ratio >= WCAG_THRESHOLDS.AA_LARGE,
      aaa: ratio >= WCAG_THRESHOLDS.AAA_NORMAL,
      aaaLarge: ratio >= WCAG_THRESHOLDS.AAA_LARGE,
    },
    level: getComplianceLevel(ratio),
    score: getContrastScore(ratio),
  };
}

/**
 * Get the highest compliance level achieved
 *
 * @param {number} ratio - Contrast ratio
 * @returns {'AAA' | 'AA' | 'AA Large' | 'Fail'} Compliance level
 */
export function getComplianceLevel(ratio) {
  if (ratio >= WCAG_THRESHOLDS.AAA_NORMAL) return 'AAA';
  if (ratio >= WCAG_THRESHOLDS.AA_NORMAL) return 'AA';
  if (ratio >= WCAG_THRESHOLDS.AA_LARGE) return 'AA Large';
  return 'Fail';
}

/**
 * Get a descriptive score for the contrast
 *
 * @param {number} ratio - Contrast ratio
 * @returns {'excellent' | 'good' | 'acceptable' | 'poor'} Score
 */
export function getContrastScore(ratio) {
  if (ratio >= 7) return 'excellent';
  if (ratio >= 4.5) return 'good';
  if (ratio >= 3) return 'acceptable';
  return 'poor';
}

/**
 * Suggest a better foreground color for accessibility
 *
 * @param {string} foreground - Current foreground color
 * @param {string} background - Background color
 * @param {number} targetRatio - Target contrast ratio (default: AA)
 * @returns {string} Suggested color or original if already compliant
 */
export function suggestAccessibleColor(foreground, background, targetRatio = WCAG_THRESHOLDS.AA_NORMAL) {
  const currentRatio = getContrastRatio(foreground, background);

  if (currentRatio >= targetRatio) {
    return foreground;
  }

  const bgLuminance = getRelativeLuminance(background);

  // Determine if we need lighter or darker foreground
  if (bgLuminance > 0.5) {
    // Light background: suggest darker text
    return 'oklch(0.2 0 0)'; // Near black
  } else {
    // Dark background: suggest lighter text
    return 'oklch(0.95 0 0)'; // Near white
  }
}

/**
 * Generate accessible color pairs
 *
 * @param {string} baseColor - Base color to check against
 * @returns {Object} Object with accessible foreground options
 */
export function getAccessiblePairs(baseColor) {
  const whiteFg = checkContrast('oklch(1 0 0)', baseColor);
  const blackFg = checkContrast('oklch(0 0 0)', baseColor);

  return {
    white: {
      color: 'oklch(1 0 0)',
      ...whiteFg,
    },
    black: {
      color: 'oklch(0 0 0)',
      ...blackFg,
    },
    recommended: whiteFg.ratio > blackFg.ratio ? 'white' : 'black',
  };
}

/**
 * Badge data for UI display
 *
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 * @returns {Object} Badge display data
 */
export function getContrastBadge(foreground, background) {
  const result = checkContrast(foreground, background);

  return {
    ratio: result.ratio.toFixed(1),
    level: result.level,
    score: result.score,
    color: getBadgeColor(result.score),
    icon: getBadgeIcon(result.level),
  };
}

/**
 * Get badge color based on score
 */
function getBadgeColor(score) {
  switch (score) {
    case 'excellent':
      return 'oklch(0.7 0.15 145)'; // Green
    case 'good':
      return 'oklch(0.75 0.15 95)'; // Yellow-green
    case 'acceptable':
      return 'oklch(0.7 0.15 70)'; // Orange
    default:
      return 'oklch(0.65 0.2 25)'; // Red
  }
}

/**
 * Get badge icon based on level
 */
function getBadgeIcon(level) {
  switch (level) {
    case 'AAA':
      return '★★★';
    case 'AA':
      return '★★';
    case 'AA Large':
      return '★';
    default:
      return '✕';
  }
}

export default {
  WCAG_THRESHOLDS,
  getContrastRatio,
  checkContrast,
  getComplianceLevel,
  getContrastScore,
  suggestAccessibleColor,
  getAccessiblePairs,
  getContrastBadge,
};
