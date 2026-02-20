export interface Gradient {
  name: string;
  css: string;
  preview: string; // tailwind-compatible inline style
}

export const GRADIENTS: Gradient[] = [
  // Ocean Blues
  { name: 'Ocean Deep', css: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { name: 'Sky Surge', css: 'linear-gradient(135deg, #1a6dff, #00d2d3, #48dbfb)', preview: 'linear-gradient(135deg, #1a6dff, #00d2d3, #48dbfb)' },
  { name: 'Aqua Depth', css: 'linear-gradient(135deg, #005c97, #363795)', preview: 'linear-gradient(135deg, #005c97, #363795)' },
  { name: 'Midnight Wave', css: 'linear-gradient(135deg, #141e30, #243b55)', preview: 'linear-gradient(135deg, #141e30, #243b55)' },
  { name: 'Coral Reef', css: 'linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc)', preview: 'linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc)' },

  // Purple/Pink Swirls
  { name: 'Liquid Glass', css: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)', preview: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)' },
  { name: 'Aurora', css: 'linear-gradient(135deg, #a18cd1, #fbc2eb, #a6c0fe)', preview: 'linear-gradient(135deg, #a18cd1, #fbc2eb, #a6c0fe)' },
  { name: 'Cosmic Bloom', css: 'linear-gradient(135deg, #4776e6, #8e54e9, #f953c6)', preview: 'linear-gradient(135deg, #4776e6, #8e54e9, #f953c6)' },
  { name: 'Nebula', css: 'linear-gradient(135deg, #360033, #0b8793, #a855f7)', preview: 'linear-gradient(135deg, #360033, #0b8793, #a855f7)' },
  { name: 'Violet Dream', css: 'linear-gradient(135deg, #7928ca, #ff0080)', preview: 'linear-gradient(135deg, #7928ca, #ff0080)' },

  // Sunset Oranges
  { name: 'Golden Hour', css: 'linear-gradient(135deg, #f7971e, #ffd200, #ff4e50)', preview: 'linear-gradient(135deg, #f7971e, #ffd200, #ff4e50)' },
  { name: 'Sunset Blaze', css: 'linear-gradient(135deg, #f83600, #f9d423)', preview: 'linear-gradient(135deg, #f83600, #f9d423)' },
  { name: 'Mango Tango', css: 'linear-gradient(135deg, #f7bb97, #dd5e89, #f7bb97)', preview: 'linear-gradient(135deg, #f7bb97, #dd5e89, #f7bb97)' },
  { name: 'Ember Glow', css: 'linear-gradient(135deg, #eb3349, #f45c43)', preview: 'linear-gradient(135deg, #eb3349, #f45c43)' },
  { name: 'Desert Sand', css: 'linear-gradient(135deg, #ff9966, #ff5e62)', preview: 'linear-gradient(135deg, #ff9966, #ff5e62)' },

  // Neon Darks
  { name: 'Neon Night', css: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e, #0f3460)', preview: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e, #0f3460)' },
  { name: 'Cyber Punk', css: 'linear-gradient(135deg, #000000, #e100ff, #7f00ff)', preview: 'linear-gradient(135deg, #000000, #e100ff, #7f00ff)' },
  { name: 'Dark Matter', css: 'linear-gradient(135deg, #09203f, #537895)', preview: 'linear-gradient(135deg, #09203f, #537895)' },
  { name: 'Void Space', css: 'linear-gradient(135deg, #000000, #434343)', preview: 'linear-gradient(135deg, #000000, #434343)' },
  { name: 'Neon Flux', css: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)', preview: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)' },

  // Aurora Greens
  { name: 'Aurora Borealis', css: 'linear-gradient(135deg, #085078, #85d8ce, #4ecdc4)', preview: 'linear-gradient(135deg, #085078, #85d8ce, #4ecdc4)' },
  { name: 'Forest Mist', css: 'linear-gradient(135deg, #134e5e, #71b280)', preview: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { name: 'Emerald Sea', css: 'linear-gradient(135deg, #43b89c, #0f6b6b)', preview: 'linear-gradient(135deg, #43b89c, #0f6b6b)' },
  { name: 'Jade Fusion', css: 'linear-gradient(135deg, #00b09b, #96c93d)', preview: 'linear-gradient(135deg, #00b09b, #96c93d)' },
  { name: 'Mint Haze', css: 'linear-gradient(135deg, #a8edea, #fed6e3)', preview: 'linear-gradient(135deg, #a8edea, #fed6e3)' },

  // Pastels
  { name: 'Cotton Candy', css: 'linear-gradient(135deg, #ffecd2, #fcb69f)', preview: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { name: 'Blush', css: 'linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef)' },
  { name: 'Lavender Mist', css: 'linear-gradient(135deg, #a29bfe, #dfe6e9)', preview: 'linear-gradient(135deg, #a29bfe, #dfe6e9)' },
  { name: 'Peach Cream', css: 'linear-gradient(135deg, #ffeaa7, #fab1a0, #fd79a8)', preview: 'linear-gradient(135deg, #ffeaa7, #fab1a0, #fd79a8)' },

  // Multi-hue Vibrant
  { name: 'Prism', css: 'linear-gradient(135deg, #fc466b, #3f5efb)', preview: 'linear-gradient(135deg, #fc466b, #3f5efb)' },
  { name: 'Rainbow Arc', css: 'linear-gradient(135deg, #f6d365, #fda085, #f093fb, #667eea)', preview: 'linear-gradient(135deg, #f6d365, #fda085, #f093fb, #667eea)' },
  { name: 'Spectrum', css: 'linear-gradient(135deg, #12c2e9, #f64f59, #c471ed)', preview: 'linear-gradient(135deg, #12c2e9, #f64f59, #c471ed)' },
  { name: 'Northern Lights', css: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483)', preview: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483)' },
  { name: 'Twilight', css: 'linear-gradient(135deg, #0700b8, #00ff88)', preview: 'linear-gradient(135deg, #0700b8, #00ff88)' },
];
