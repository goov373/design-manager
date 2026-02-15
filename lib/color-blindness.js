/**
 * Color Blindness Simulation
 *
 * Implements Brettel algorithm for simulating color vision deficiencies.
 * Supports protanopia, deuteranopia, and tritanopia.
 */

import { toHexString, parseToOklch } from './color-utils';

/**
 * Color vision deficiency types
 */
export const CVD_TYPES = {
  PROTANOPIA: 'protanopia', // Red-blind
  DEUTERANOPIA: 'deuteranopia', // Green-blind
  TRITANOPIA: 'tritanopia', // Blue-blind
  ACHROMATOPSIA: 'achromatopsia', // Complete color blindness
};

/**
 * Brettel matrices for color blindness simulation
 * Based on Brettel, Viénot, and Mollon (1997)
 */
const BRETTEL_MATRICES = {
  protanopia: {
    // Projection matrix for protanopia (red-blind)
    rgb2lms: [
      [0.31399022, 0.63951294, 0.04649755],
      [0.15537241, 0.75789446, 0.08670142],
      [0.01775239, 0.10944209, 0.87256922],
    ],
    sim: [
      [0.0, 2.02344377, -2.52581341],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
    ],
    lms2rgb: [
      [5.47221206, -4.64196010, 0.16963708],
      [-1.12524190, 2.29317094, -0.16789520],
      [0.02980165, -0.19318073, 1.16364789],
    ],
  },
  deuteranopia: {
    // Projection matrix for deuteranopia (green-blind)
    rgb2lms: [
      [0.31399022, 0.63951294, 0.04649755],
      [0.15537241, 0.75789446, 0.08670142],
      [0.01775239, 0.10944209, 0.87256922],
    ],
    sim: [
      [1.0, 0.0, 0.0],
      [0.49421036, 0.0, 1.24827314],
      [0.0, 0.0, 1.0],
    ],
    lms2rgb: [
      [5.47221206, -4.64196010, 0.16963708],
      [-1.12524190, 2.29317094, -0.16789520],
      [0.02980165, -0.19318073, 1.16364789],
    ],
  },
  tritanopia: {
    // Projection matrix for tritanopia (blue-blind)
    rgb2lms: [
      [0.31399022, 0.63951294, 0.04649755],
      [0.15537241, 0.75789446, 0.08670142],
      [0.01775239, 0.10944209, 0.87256922],
    ],
    sim: [
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [-0.86744736, 1.86727089, 0.0],
    ],
    lms2rgb: [
      [5.47221206, -4.64196010, 0.16963708],
      [-1.12524190, 2.29317094, -0.16789520],
      [0.02980165, -0.19318073, 1.16364789],
    ],
  },
};

/**
 * Multiply a 3x3 matrix by a 3-element vector
 */
function multiplyMatrix(matrix, vector) {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

/**
 * Convert sRGB to linear RGB
 */
function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB to sRGB
 */
function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * Parse hex color to RGB array (0-1 range)
 */
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

/**
 * Convert RGB array to hex
 */
function rgbToHex(rgb) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));
  const r = clamp(rgb[0]).toString(16).padStart(2, '0');
  const g = clamp(rgb[1]).toString(16).padStart(2, '0');
  const b = clamp(rgb[2]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * Simulate color blindness using Brettel algorithm
 *
 * @param {string} color - Color in any format
 * @param {string} type - CVD type ('protanopia', 'deuteranopia', 'tritanopia')
 * @returns {string} Simulated color in hex format
 */
export function simulateColorBlindness(color, type) {
  // Handle achromatopsia separately (complete color blindness)
  if (type === CVD_TYPES.ACHROMATOPSIA) {
    return simulateAchromatopsia(color);
  }

  const matrices = BRETTEL_MATRICES[type];
  if (!matrices) {
    console.warn(`Unknown CVD type: ${type}`);
    return toHexString(color);
  }

  // Convert to hex first for consistent parsing
  const hex = toHexString(color);
  const rgb = hexToRgb(hex);

  // Convert to linear RGB
  const linearRgb = rgb.map(srgbToLinear);

  // Apply Brettel algorithm
  // 1. RGB to LMS
  const lms = multiplyMatrix(matrices.rgb2lms, linearRgb);

  // 2. Apply simulation matrix
  const simLms = multiplyMatrix(matrices.sim, lms);

  // 3. LMS back to RGB
  const simRgb = multiplyMatrix(matrices.lms2rgb, simLms);

  // Convert back to sRGB
  const srgb = simRgb.map(linearToSrgb);

  return rgbToHex(srgb);
}

/**
 * Simulate complete color blindness (achromatopsia)
 */
function simulateAchromatopsia(color) {
  const hex = toHexString(color);
  const rgb = hexToRgb(hex);

  // Convert to grayscale using luminance weights
  const gray = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

  return rgbToHex([gray, gray, gray]);
}

/**
 * Simulate all CVD types for a color
 *
 * @param {string} color - Color in any format
 * @returns {Object} Object with simulated colors for each type
 */
export function simulateAllTypes(color) {
  return {
    normal: toHexString(color),
    protanopia: simulateColorBlindness(color, CVD_TYPES.PROTANOPIA),
    deuteranopia: simulateColorBlindness(color, CVD_TYPES.DEUTERANOPIA),
    tritanopia: simulateColorBlindness(color, CVD_TYPES.TRITANOPIA),
    achromatopsia: simulateColorBlindness(color, CVD_TYPES.ACHROMATOPSIA),
  };
}

/**
 * Check if two colors are distinguishable under CVD
 *
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @param {string} type - CVD type
 * @param {number} threshold - Minimum difference (0-1)
 * @returns {boolean} True if colors are distinguishable
 */
export function areDistinguishable(color1, color2, type, threshold = 0.1) {
  const sim1 = simulateColorBlindness(color1, type);
  const sim2 = simulateColorBlindness(color2, type);

  const rgb1 = hexToRgb(sim1);
  const rgb2 = hexToRgb(sim2);

  // Calculate Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );

  // Normalize (max distance is sqrt(3))
  const normalizedDistance = distance / Math.sqrt(3);

  return normalizedDistance >= threshold;
}

/**
 * Analyze a color palette for CVD accessibility
 *
 * @param {string[]} colors - Array of colors
 * @returns {Object} Analysis results for each CVD type
 */
export function analyzePalette(colors) {
  const results = {};

  Object.values(CVD_TYPES).forEach((type) => {
    const issues = [];
    const simulatedColors = colors.map((c) => simulateColorBlindness(c, type));

    // Check each pair of colors
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        if (!areDistinguishable(colors[i], colors[j], type)) {
          issues.push({
            color1: colors[i],
            color2: colors[j],
            simulated1: simulatedColors[i],
            simulated2: simulatedColors[j],
          });
        }
      }
    }

    results[type] = {
      simulatedColors,
      issues,
      accessible: issues.length === 0,
    };
  });

  return results;
}

/**
 * Get CVD type description
 */
export function getCVDDescription(type) {
  switch (type) {
    case CVD_TYPES.PROTANOPIA:
      return {
        name: 'Protanopia',
        description: 'Red-blind: difficulty distinguishing red and green',
        prevalence: '~1% of males',
      };
    case CVD_TYPES.DEUTERANOPIA:
      return {
        name: 'Deuteranopia',
        description: 'Green-blind: difficulty distinguishing red and green',
        prevalence: '~1% of males',
      };
    case CVD_TYPES.TRITANOPIA:
      return {
        name: 'Tritanopia',
        description: 'Blue-blind: difficulty distinguishing blue and yellow',
        prevalence: '~0.003% of population',
      };
    case CVD_TYPES.ACHROMATOPSIA:
      return {
        name: 'Achromatopsia',
        description: 'Complete color blindness: sees only grayscale',
        prevalence: '~0.003% of population',
      };
    default:
      return {
        name: 'Normal',
        description: 'Normal color vision',
        prevalence: '~92% of population',
      };
  }
}

export default {
  CVD_TYPES,
  simulateColorBlindness,
  simulateAllTypes,
  areDistinguishable,
  analyzePalette,
  getCVDDescription,
};
