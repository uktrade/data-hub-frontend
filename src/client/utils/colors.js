/**
 * Convert a color hex to an rgb value
 *
 * Note that this currently only works with 6 digit hexes.
 */
export const hexToRgb = (colorHex) => {
  const colorValue = parseInt(colorHex.replace('#', ''), 16)
  return [
    (colorValue >> 16) & 255,
    (colorValue >> 8) & 255,
    colorValue & 255,
  ].join()
}

/**
 * Convert a color hex and alpha to an rgba value
 *
 * Note that this currently only works with 6 digit hexes.
 */
export const rgba = (colorHex, alpha) => `rgba(${hexToRgb(colorHex)},${alpha})`
