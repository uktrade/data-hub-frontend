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
// Instead, the colours below have been taken from:
// - https://github.com/alphagov/govuk-frontend (referenced by GOV.UK Design System)

// Taken from the legacy palette, we're unable to choose a colour
// from the modern palette as it's either too light or too dark
// for the Data Hub header nav element which sits in between a
// darker and lighter shade of grey forming a natural gradient.
export const LIGHT_GREY = '#dee0e2'

// We require this specific blue for the navigation hover/selection.
// This blue has to match the colour of both 'Find Exporters' and 'Market Access'.
// It is also used for the investment project timeline.
export const DARK_BLUE = '#005ea5'

export const DARK_GREY = '#505a5f'
export const MID_GREY = '#b1b4b6'
export const FOCUS_COLOUR = '#ffdd00'
