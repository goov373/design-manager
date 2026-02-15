/**
 * useColorExtraction Hook
 *
 * Extracts dominant colors from an image using median cut color quantization.
 * Returns a 5-color palette suitable for theme generation.
 */

import { useState, useCallback } from 'react';
import { toOklchString } from '../lib/color-utils';

/**
 * Color extraction states
 */
const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Convert RGB to relative luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Median cut color quantization
 * Recursively splits color space to find dominant colors
 */
function medianCut(pixels, depth, maxDepth = 3) {
  if (depth >= maxDepth || pixels.length === 0) {
    // Average all pixels in this bucket
    const avg = pixels.reduce(
      (acc, p) => {
        acc.r += p.r;
        acc.g += p.g;
        acc.b += p.b;
        return acc;
      },
      { r: 0, g: 0, b: 0 }
    );

    const count = pixels.length || 1;
    return [
      {
        r: Math.round(avg.r / count),
        g: Math.round(avg.g / count),
        b: Math.round(avg.b / count),
        count,
      },
    ];
  }

  // Find the color channel with the greatest range
  const ranges = ['r', 'g', 'b'].map((channel) => {
    const values = pixels.map((p) => p[channel]);
    return {
      channel,
      range: Math.max(...values) - Math.min(...values),
    };
  });

  const sortChannel = ranges.sort((a, b) => b.range - a.range)[0].channel;

  // Sort pixels by that channel and split at median
  pixels.sort((a, b) => a[sortChannel] - b[sortChannel]);
  const mid = Math.floor(pixels.length / 2);

  return [
    ...medianCut(pixels.slice(0, mid), depth + 1, maxDepth),
    ...medianCut(pixels.slice(mid), depth + 1, maxDepth),
  ];
}

/**
 * Sample pixels from an image
 */
function samplePixels(imageData, sampleSize = 10000) {
  const pixels = [];
  const data = imageData.data;
  const step = Math.max(1, Math.floor(data.length / 4 / sampleSize));

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent and very dark/light pixels
    if (a < 128) continue;
    const lum = getLuminance(r, g, b);
    if (lum < 0.05 || lum > 0.95) continue;

    pixels.push({ r, g, b });
  }

  return pixels;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((c) => {
        const hex = Math.max(0, Math.min(255, c)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

/**
 * Sort colors by visual weight/importance
 */
function sortColorsByImportance(colors) {
  return colors.sort((a, b) => {
    // Consider both count and saturation
    const satA = Math.max(a.r, a.g, a.b) - Math.min(a.r, a.g, a.b);
    const satB = Math.max(b.r, b.g, b.b) - Math.min(b.r, b.g, b.b);
    const scoreA = a.count * (1 + satA / 255);
    const scoreB = b.count * (1 + satB / 255);
    return scoreB - scoreA;
  });
}

/**
 * Hook for extracting colors from images
 */
export function useColorExtraction() {
  const [state, setState] = useState(STATES.IDLE);
  const [palette, setPalette] = useState([]);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  /**
   * Extract colors from an image file
   */
  const extractFromFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please provide a valid image file');
      setState(STATES.ERROR);
      return;
    }

    setState(STATES.LOADING);
    setError(null);

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      // Draw to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Scale down for performance
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = samplePixels(imageData);

      if (pixels.length < 10) {
        throw new Error('Not enough distinct colors in image');
      }

      // Extract colors using median cut (depth 3 = 8 colors, then take top 5)
      let colors = medianCut(pixels, 0, 3);
      colors = sortColorsByImportance(colors);
      colors = colors.slice(0, 5);

      // Convert to palette format
      const extractedPalette = colors.map((c, i) => {
        const hex = rgbToHex(c.r, c.g, c.b);
        const oklch = toOklchString({ r: c.r, g: c.g, b: c.b });
        const luminance = getLuminance(c.r, c.g, c.b);

        return {
          hex,
          oklch,
          rgb: { r: c.r, g: c.g, b: c.b },
          luminance,
          role: getPaletteRole(i, luminance),
        };
      });

      setPalette(extractedPalette);
      setState(STATES.SUCCESS);
    } catch (e) {
      setError(e.message);
      setState(STATES.ERROR);
    }
  }, []);

  /**
   * Extract from a URL
   */
  const extractFromUrl = useCallback(async (url) => {
    setState(STATES.LOADING);
    setError(null);

    try {
      // Fetch the image
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      await extractFromFile(file);
    } catch (e) {
      setError('Failed to load image from URL');
      setState(STATES.ERROR);
    }
  }, [extractFromFile]);

  /**
   * Clear the current extraction
   */
  const clear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setState(STATES.IDLE);
    setPalette([]);
    setError(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  return {
    state,
    isLoading: state === STATES.LOADING,
    isSuccess: state === STATES.SUCCESS,
    isError: state === STATES.ERROR,
    palette,
    error,
    previewUrl,
    extractFromFile,
    extractFromUrl,
    clear,
  };
}

/**
 * Suggest a role for each extracted color based on position and luminance
 */
function getPaletteRole(index, luminance) {
  // First color (most dominant) is often a good primary
  if (index === 0) return 'primary';

  // Very light colors work well as backgrounds
  if (luminance > 0.8) return 'background';

  // Very dark colors work well as foregrounds
  if (luminance < 0.2) return 'foreground';

  // Second most dominant is often a good accent
  if (index === 1) return 'accent';

  // Medium luminance colors are good for muted states
  if (luminance > 0.3 && luminance < 0.7) return 'muted';

  return 'secondary';
}

export default useColorExtraction;
