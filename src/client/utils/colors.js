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

// Currently we import our colours from here: https://github.com/penx/govuk-colours/blob/master/src/index.js
// GOV.UK Design System colours are here: https://github.com/alphagov/govuk-frontend/blob/main/src/govuk/settings/_colours-palette.scss
// Unfortunately, 'govuk-colours' has not been updated for a while and we need the following grey colours from the GDS modern palette
export const DARK_GREY = '#505a5f'
export const MID_GREY = '#b1b4b6'
export const LIGHT_GREY = '#f3f2f1' // This is GREY_3 from 'govuk-colours'

// -----------------------------------
// Taken from the GDS legacy palette
// -----------------------------------
// We're unable to choose a colour from the GDS modern palette as
// it's either too light or too dark for the Data Hub header nav
// element which sits in between a darker and lighter shade of grey
// forming a natural gradient.
export const GREY_3_LEGACY = '#dee0e2'

// -----------------------------------
// Taken from the GDS legacy palette
// -----------------------------------
// We're unable to choose a colour from the GDS modern palette.
// We require this specific blue for the navigation hover/selection.
// This blue has to match the colour of both 'Find Exporters' and 'Market Access'.
// It is also used for the investment project timeline.
export const DARK_BLUE_LEGACY = '#005ea5'
