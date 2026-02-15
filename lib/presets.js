/**
 * Built-in Theme Presets
 *
 * Pre-configured color themes that can be applied instantly.
 * Each preset includes light and dark mode CSS variables.
 */

export const BUILT_IN_PRESETS = [
  {
    id: 'default',
    name: 'Default (Amber)',
    description: 'Warm amber papercraft theme',
    colors: {
      primary: 'oklch(0.666 0.179 58.318)',
      accent: 'oklch(0.705 0.191 47.604)',
      background: 'oklch(0.987 0.022 95.277)',
    },
    css: null, // Uses default CSS
  },
  {
    id: 'forest-meadow',
    name: 'Forest Meadow',
    description: 'Fresh green with orange accents',
    colors: {
      primary: 'oklch(0.5033 0.1399 149.6019)',
      accent: 'oklch(0.7582 0.0561 123.7742)',
      background: 'oklch(0.9815 0.0073 132.4141)',
    },
    css: `:root {
  --background: oklch(0.9815 0.0073 132.4141);
  --foreground: oklch(0.2463 0.0129 258.3721);
  --card: oklch(0.9974 0.0056 128.5237);
  --card-foreground: oklch(0.0000 0.0000 0.0000);
  --popover: oklch(0.9974 0.0056 128.5237);
  --popover-foreground: oklch(0.0000 0.0000 0.0000);
  --primary: oklch(0.5033 0.1399 149.6019);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.6230 0.1258 70.7906);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.9548 0.0164 121.7705);
  --muted-foreground: oklch(0.5363 0.0236 122.2078);
  --accent: oklch(0.7582 0.0561 123.7742);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.5507 0.1744 139.3368);
  --border: oklch(0.9266 0.0263 123.4396);
  --input: oklch(0.8262 0.0255 121.9922);
  --ring: oklch(0.6043 0.1405 149.5930);
}
.dark {
  --background: oklch(0.1816 0.0159 119.4121);
  --foreground: oklch(0.9461 0.0000 0.0000);
  --card: oklch(0.1507 0.0135 115.0483);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.1507 0.0135 115.0483);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7062 0.1207 158.5659);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.6998 0.1068 76.4583);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.2174 0.0136 120.4922);
  --muted-foreground: oklch(0.7234 0.0044 121.5910);
  --accent: oklch(0.4396 0.1101 124.7054);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.6710 0.2048 138.9434);
  --border: oklch(0.2866 0.0073 118.2750);
  --input: oklch(0.3878 0.0084 115.9746);
  --ring: oklch(0.6047 0.1205 158.5127);
}`,
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    description: 'Cool blue and teal tones',
    colors: {
      primary: 'oklch(0.5091 0.0947 222.8499)',
      accent: 'oklch(0.7652 0.0517 180.3042)',
      background: 'oklch(0.9817 0.0057 264.5328)',
    },
    css: `:root {
  --background: oklch(0.9817 0.0057 264.5328);
  --foreground: oklch(0.2463 0.0129 258.3721);
  --card: oklch(0.9985 0.0021 197.1238);
  --card-foreground: oklch(0.0000 0.0000 0.0000);
  --popover: oklch(0.9985 0.0021 197.1238);
  --popover-foreground: oklch(0.0000 0.0000 0.0000);
  --primary: oklch(0.5091 0.0947 222.8499);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.5449 0.1065 228.6478);
  --secondary-foreground: oklch(1.0000 0.0000 0.0000);
  --muted: oklch(0.9454 0.0187 265.9819);
  --muted-foreground: oklch(0.5240 0.0266 266.7015);
  --accent: oklch(0.7652 0.0517 180.3042);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.5649 0.1976 287.4462);
  --border: oklch(0.9055 0.0307 265.3249);
  --input: oklch(0.8063 0.0303 264.3907);
  --ring: oklch(0.6088 0.0946 222.9309);
}
.dark {
  --background: oklch(0.1686 0.0322 260.3378);
  --foreground: oklch(0.9461 0.0000 0.0000);
  --card: oklch(0.1402 0.0316 258.7964);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.1402 0.0316 258.7964);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7252 0.1302 217.8508);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.6743 0.1002 229.4848);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.2132 0.0213 263.9644);
  --muted-foreground: oklch(0.7212 0.0124 264.4898);
  --accent: oklch(0.4765 0.0920 172.3996);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.6780 0.1532 290.8433);
  --border: oklch(0.2799 0.0221 262.4889);
  --input: oklch(0.3808 0.0210 259.4005);
  --ring: oklch(0.6324 0.1160 221.0131);
}`,
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Minimal grayscale palette',
    colors: {
      primary: 'oklch(0.4381 0.0042 354.8654)',
      accent: 'oklch(0.7163 0.0012 17.1848)',
      background: 'oklch(0.9761 0.0000 0.0000)',
    },
    css: `:root {
  --background: oklch(0.9761 0.0000 0.0000);
  --foreground: oklch(0.1776 0.0000 0.0000);
  --card: oklch(1.0000 0.0000 0.0000);
  --card-foreground: oklch(0.0000 0.0000 0.0000);
  --popover: oklch(1.0000 0.0000 0.0000);
  --popover-foreground: oklch(0.0000 0.0000 0.0000);
  --primary: oklch(0.4381 0.0042 354.8654);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.5103 0.0000 0.0000);
  --secondary-foreground: oklch(1.0000 0.0000 0.0000);
  --muted: oklch(0.9431 0.0000 0.0000);
  --muted-foreground: oklch(0.5231 0.0077 5.8280);
  --accent: oklch(0.7163 0.0012 17.1848);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.5357 0.0012 17.1964);
  --border: oklch(0.9006 0.0000 0.0000);
  --input: oklch(0.8015 0.0000 0.0000);
  --ring: oklch(0.5378 0.0040 354.8028);
}
.dark {
  --background: oklch(0.2090 0.0000 0.0000);
  --foreground: oklch(1.0000 0.0000 0.0000);
  --card: oklch(0.1776 0.0000 0.0000);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.1776 0.0000 0.0000);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7284 0.0000 0.0000);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.7284 0.0000 0.0000);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.2170 0.0102 355.9078);
  --muted-foreground: oklch(0.7231 0.0018 325.5951);
  --accent: oklch(0.4005 0.0131 355.5123);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.6588 0.0072 5.7329);
  --border: oklch(0.2891 0.0000 0.0000);
  --input: oklch(0.3904 0.0000 0.0000);
  --ring: oklch(0.6268 0.0000 0.0000);
}`,
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    description: 'Soft pink and magenta tones',
    colors: {
      primary: 'oklch(0.4493 0.1560 347.9904)',
      accent: 'oklch(0.7883 0.0611 212.1546)',
      background: 'oklch(0.9399 0.0203 345.6984)',
    },
    css: `:root {
  --background: oklch(0.9399 0.0203 345.6984);
  --foreground: oklch(0.4712 0.0000 0.0000);
  --card: oklch(0.9692 0.0192 343.9343);
  --card-foreground: oklch(0.0000 0.0000 0.0000);
  --popover: oklch(0.9692 0.0192 343.9343);
  --popover-foreground: oklch(0.0000 0.0000 0.0000);
  --primary: oklch(0.4493 0.1560 347.9904);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.5251 0.0592 198.5411);
  --secondary-foreground: oklch(1.0000 0.0000 0.0000);
  --muted: oklch(0.9055 0.0623 344.0653);
  --muted-foreground: oklch(0.5251 0.1677 348.0801);
  --accent: oklch(0.7883 0.0611 212.1546);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.6302 0.0699 87.7535);
  --border: oklch(0.8387 0.0986 348.3813);
  --input: oklch(0.7391 0.0980 348.3666);
  --ring: oklch(0.5485 0.1562 347.9572);
}
.dark {
  --background: oklch(0.2497 0.0305 234.1628);
  --foreground: oklch(0.9306 0.0197 349.0784);
  --card: oklch(0.2206 0.0309 234.8662);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.2206 0.0309 234.8662);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7258 0.0728 87.2075);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.7794 0.0803 4.1330);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.2272 0.0298 241.5558);
  --muted-foreground: oklch(0.7305 0.0224 241.4716);
  --accent: oklch(0.3992 0.0612 3.3090);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.6699 0.0988 356.9762);
  --border: oklch(0.3080 0.0346 242.6067);
  --input: oklch(0.4067 0.0348 242.4675);
  --ring: oklch(0.6252 0.0729 86.5840);
}`,
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Vibrant green on dark background',
    colors: {
      primary: 'oklch(0.5466 0.1334 122.5747)',
      accent: 'oklch(0.7344 0.1374 130.0166)',
      background: 'oklch(0.3172 0.0868 139.1811)',
    },
    css: `:root {
  --background: oklch(0.3172 0.0868 139.1811);
  --foreground: oklch(0.9424 0.1962 121.0608);
  --card: oklch(0.3470 0.0867 139.2042);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.3470 0.0867 139.2042);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.5466 0.1334 122.5747);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.6726 0.2289 142.4953);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.9020 0.0731 129.7714);
  --muted-foreground: oklch(0.4837 0.1337 131.7125);
  --accent: oklch(0.7344 0.1374 130.0166);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.5455 0.0804 140.6323);
  --border: oklch(0.8169 0.1047 129.7986);
  --input: oklch(0.7171 0.1054 129.8415);
  --ring: oklch(0.6477 0.1339 122.6188);
}
.dark {
  --background: oklch(0.1996 0.0501 138.4069);
  --foreground: oklch(0.9424 0.1962 121.0608);
  --card: oklch(0.1698 0.0488 138.6558);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.1698 0.0488 138.6558);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7422 0.1779 120.8801);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.7697 0.2619 142.4953);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.2248 0.0662 135.4491);
  --muted-foreground: oklch(0.7133 0.0924 128.6331);
  --accent: oklch(0.4010 0.1138 133.3280);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.6380 0.0481 139.0019);
  --border: oklch(0.3007 0.0836 132.1240);
  --input: oklch(0.4005 0.0835 132.4122);
  --ring: oklch(0.6439 0.1562 121.9822);
}`,
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Warm earthy brown tones',
    colors: {
      primary: 'oklch(0.4743 0.1320 46.6067)',
      accent: 'oklch(0.7258 0.0090 56.2618)',
      background: 'oklch(0.9885 0.0057 84.5659)',
    },
    css: `:root {
  --background: oklch(0.9885 0.0057 84.5659);
  --foreground: oklch(0.3660 0.0251 49.6084);
  --card: oklch(0.9989 0.0053 106.4943);
  --card-foreground: oklch(0.0000 0.0000 0.0000);
  --popover: oklch(0.9989 0.0053 106.4943);
  --popover-foreground: oklch(0.0000 0.0000 0.0000);
  --primary: oklch(0.4743 0.1320 46.6067);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.5348 0.0639 75.1808);
  --secondary-foreground: oklch(1.0000 0.0000 0.0000);
  --muted: oklch(0.9522 0.0193 90.5436);
  --muted-foreground: oklch(0.5678 0.0342 88.4112);
  --accent: oklch(0.7258 0.0090 56.2618);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.5538 0.1207 66.4416);
  --border: oklch(0.9193 0.0305 90.3355);
  --input: oklch(0.8200 0.0310 92.3631);
  --ring: oklch(0.5746 0.1320 46.6392);
}
.dark {
  --background: oklch(0.2161 0.0061 56.0433);
  --foreground: oklch(0.9699 0.0013 106.4243);
  --card: oklch(0.1850 0.0064 55.9597);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.1850 0.0064 55.9597);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7049 0.1867 47.6044);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.6973 0.0068 75.3872);
  --secondary-foreground: oklch(0.0000 0.0000 0.0000);
  --muted: oklch(0.2225 0.0161 71.1564);
  --muted-foreground: oklch(0.7235 0.0055 67.7377);
  --accent: oklch(0.3713 0.0956 246.0800);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.7027 0.1442 84.1719);
  --border: oklch(0.2968 0.0115 67.3615);
  --input: oklch(0.3971 0.0120 72.4786);
  --ring: oklch(0.6066 0.1808 42.6576);
}`,
  },
];

/**
 * Get a preset by ID
 * @param {string} presetId - The preset ID
 * @returns {Object|null} The preset or null if not found
 */
export function getPresetById(presetId) {
  return BUILT_IN_PRESETS.find((p) => p.id === presetId) || null;
}

/**
 * Apply a built-in preset by injecting CSS
 * @param {string} presetId - The preset ID to apply
 * @returns {boolean} Whether the preset was applied
 */
export function applyBuiltInPreset(presetId) {
  const preset = getPresetById(presetId);
  if (!preset) return false;

  // Remove any existing preset style element
  const existingStyle = document.getElementById('dm-preset-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // If it's the default preset, just remove the override styles
  if (preset.id === 'default' || !preset.css) {
    return true;
  }

  // Create and inject the preset styles
  const styleElement = document.createElement('style');
  styleElement.id = 'dm-preset-styles';
  styleElement.textContent = preset.css;
  document.head.appendChild(styleElement);

  return true;
}

/**
 * Remove any applied preset styles
 */
export function removePresetStyles() {
  const existingStyle = document.getElementById('dm-preset-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
}
