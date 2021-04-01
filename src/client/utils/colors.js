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

// The following colours are not included in either:
// - https://github.com/penx/govuk-colours or
// - https://github.com/govuk-react/govuk-react (which references govuk-colours)
// Instead, the colours have been taken from:
// - https://github.com/alphagov/govuk-frontend (referenced by GOV.UK Design System)
export const DARK_GREY = '#505a5f'
export const MID_GREY = '#b1b4b6'
export const FOCUS_COLOUR = '#ffdd00'
