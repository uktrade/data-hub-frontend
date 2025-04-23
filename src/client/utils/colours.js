/**
 * Converts a hex colour code to an RGB object.
 *
 * @param {string} hex - The hex colour code, with or without a leading '#'.
 * @returns {Object} An object with the red, green, and blue colour values.
 * @throws {Error} If the hex colour code is not valid (i.e., not 6 characters).
 *
 * @example
 * hexToRgb('#3498db') // returns { r: 52, g: 152, b: 219 }
 * hexToRgb('3498db')   // returns { r: 52, g: 152, b: 219 }
 */

export const hexToRgb = (hex) => {
  const cleanHex = hex.replace(/^#/, '')

  if (cleanHex.length !== 6) {
    throw new Error('Invalid hex colour')
  }

  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)

  return { r, g, b }
}

/**
 * Converts a hex colour code to an RGB string format using hexToRgb.
 *
 * @param {string} colorHex - The hex colour code, with or without a leading '#'.
 * @returns {string} The RGB colour in the format `rgb(r, g, b)`.
 *
 * @example
 * formatRgb('#3498db') // returns "rgb(52, 152, 219)"
 */
export const rgb = (colorHex) => {
  const { r, g, b } = hexToRgb(colorHex)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Converts a hex colour code to an RGBA string format with a specified alpha value.
 *
 * @param {string} colorHex - The hex colour code, with or without a leading '#'.
 * @param {number} alpha - The alpha value for the colour's opacity, between 0 (transparent) and 1 (opaque).
 * @returns {string} The RGBA colour in the format `rgba(r, g, b, alpha)`.
 *
 * @example
 * rgba('#3498db', 0.5) // returns "rgba(52, 152, 219, 0.5)"
 * rgba('3498db', 1)    // returns "rgba(52, 152, 219, 1)"
 */
export const rgba = (colorHex, alpha) => {
  const { r, g, b } = hexToRgb(colorHex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// We used to import colours from here: https://github.com/penx/govuk-colours/blob/master/src/index.js
// GOV.UK Design System colours are here: https://github.com/alphagov/govuk-frontend/blob/main/src/govuk/settings/_colours-palette.scss
// Unfortunately, 'govuk-colours' has not been updated for a while and we needed updated colours to meet accessibility standards
// and be up to date with GDS modern palette, so we have imported `govuk-colours` here and so we can modify them freely to match our needs.
// For libraries that use `govuk-colours` we have created a webpack alias so that they actually import this file and so we can have
// uniform colours across the different components as a result.

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
// This blue has to match the colour of both 'Find Exporters' and 'Market access'.
// It is also used for the investment project timeline.
export const DARK_BLUE_LEGACY = '#005ea5'

export const DARK_GREY = '#505a5f'
export const MID_GREY = '#b1b4b6'
export const LIGHT_GREY = '#f3f2f1'
export const MID_BLUE = '#003399'

// Colours below are coming from govuk-react
// Based on https://github.com/alphagov/govuk-frontend/blob/main/src/govuk/settings/_colours-palette.scss
export const BLUE = '#1d70b8'
export const MAINSTREAM_BRAND = BLUE
export const PURPLE = '#2e358b'
export const PURPLE_50 = '#9799c4'
export const PURPLE_25 = '#d5d6e7'
export const MAUVE = '#6f72af'
export const MAUVE_50 = '#b7b9d7'
export const MAUVE_25 = '#e2e2ef'
export const FUSCHIA = '#912b88'
export const FUSCHIA_50 = '#c994c3'
export const FUSCHIA_25 = '#e9d4e6'
export const PINK = '#d53880'
export const PINK_50 = '#eb9bbe'
export const PINK_25 = '#f6d7e5'
export const BABY_PINK = '#f499be'
export const BABY_PINK_50 = '#faccdf'
export const BABY_PINK_25 = '#fdebf2'
export const RED = '#d4351c'
export const RED_50 = '#d9888c'
export const RED_25 = '#efcfd1'
export const RED_2 = '#b10e1e'
export const MELLOW_RED = '#df3034'
export const MELLOW_RED_50 = '#ef9998'
export const MELLOW_RED_25 = '#f9d6d6'
export const ORANGE = '#f47738'
export const ORANGE_50 = '#fabb96'
export const ORANGE_25 = '#fde4d4'
export const BROWN = '#b58840'
export const BROWN_50 = '#dac39c'
export const BROWN_25 = '#f0e7d7'
export const YELLOW = '#ffdd00'
export const YELLOW_50 = '#ffdf94'
export const YELLOW_25 = '#fff2d3'
export const GRASS_GREEN = '#85994b'
export const GRASS_GREEN_50 = '#c2cca3'
export const GRASS_GREEN_25 = '#e7ebda'
export const GREEN = '#006435'
export const GREEN_50 = '#7fb299'
export const GREEN_25 = '#cce0d6'
export const TURQUOISE = '#28a197'
export const TURQUOISE_50 = '#95d0cb'
export const TURQUOISE_25 = '#d5ecea'
export const LIGHT_BLUE = '#2b8cc4'
export const LIGHT_BLUE_50 = '#96c6e2'
export const LIGHT_BLUE_25 = '#d5e8f3'
export const BLACK = '#0b0c0c'
export const GREY_1 = DARK_GREY
export const GREY_2 = '#bfc1c3'
export const GREY_3 = LIGHT_GREY
export const GREY_4 = '#f8f8f8'
export const WHITE = '#ffffff'
export const LINK_COLOUR = BLUE
export const LINK_ACTIVE_COLOUR = LIGHT_BLUE
export const LINK_HOVER_COLOUR = '#003078'
export const LINK_VISITED_COLOUR = '#4c2c92'
export const BUTTON_COLOUR = '#00703c'
export const BUTTON_COLOUR_DARKEN_15 = '#002413' //darken(#00703c, 15%)
export const FOCUS_COLOUR = YELLOW
export const TEXT_COLOUR = BLACK
export const SECONDARY_TEXT_COLOUR = GREY_1
export const BORDER_COLOUR = GREY_2
export const PANEL_COLOUR = GREY_3
export const CANVAS_COLOUR = GREY_4
export const HIGHLIGHT_COLOUR = GREY_4
export const PAGE_COLOUR = WHITE
export const DISCOVERY_COLOUR = FUSCHIA
export const ALPHA_COLOUR = PINK
export const BETA_COLOUR = ORANGE
export const LIVE_COLOUR = GRASS_GREEN
export const BANNER_TEXT_COLOUR = '#000000'
export const ERROR_COLOUR = RED
export const ERROR_BACKGROUND = '#fef7f7'
export const PROPOSITION_BORDER = '#2e3133'
export const PROPOSITION_ACTIVE_NAV = '#1d8feb'
export const FOOTER_BACKGROUND = GREY_3
export const FOOTER_BORDER_TOP = '#a1acb2'
export const FOOTER_LINK = '#454a4c'
export const FOOTER_LINK_HOVER = '#171819'
export const FOOTER_TEXT = FOOTER_LINK
export const ATTORNEY_GENERALS_OFFICE = '#9f1888'
export const ATTORNEY_GENERALS_OFFICE_WEBSAFE = '#a03a88'
export const CABINET_OFFICE = '#005abb'
export const CABINET_OFFICE_WEBSAFE = '#347da4'
export const CIVIL_SERVICE = '#af292e'
export const DEPARTMENT_FOR_BUSINESS_INNOVATION_SKILLS = '#003479'
export const DEPARTMENT_FOR_BUSINESS_INNOVATION_SKILLS_WEBSAFE = '#347da4'
export const DEPARTMENT_FOR_COMMUNITIES_AND_LOCAL_GOVERNMENT = '#00857e'
export const DEPARTMENT_FOR_COMMUNITIES_AND_LOCAL_GOVERNMENT_WEBSAFE = '#37836e'
export const DEPARTMENT_FOR_CULTURE_MEDIA_SPORT = '#d40072'
export const DEPARTMENT_FOR_CULTURE_MEDIA_SPORT_WEBSAFE = '#a03155'
export const DEPARTMENT_FOR_EDUCATION = '#003a69'
export const DEPARTMENT_FOR_EDUCATION_WEBSAFE = '#347ca9'
export const DEPARTMENT_FOR_ENVIRONMENT_FOOD_RURAL_AFFAIRS = '#00a33b'
export const DEPARTMENT_FOR_INTERNATIONAL_DEVELOPMENT = '#002878'
export const DEPARTMENT_FOR_INTERNATIONAL_DEVELOPMENT_WEBSAFE = '#405e9a'
export const DEPARTMENT_FOR_TRANSPORT = '#006c56'
export const DEPARTMENT_FOR_TRANSPORT_WEBSAFE = '#398373'
export const DEPARTMENT_FOR_WORK_PENSIONS = '#00beb7'
export const DEPARTMENT_FOR_WORK_PENSIONS_WEBSAFE = '#37807b'
export const DEPARTMENT_OF_ENERGY_CLIMATE_CHANGE = '#009ddb'
export const DEPARTMENT_OF_ENERGY_CLIMATE_CHANGE_WEBSAFE = '#2b7cac'
export const DEPARTMENT_OF_HEALTH = '#00ad93'
export const DEPARTMENT_OF_HEALTH_WEBSAFE = '#39836e'
export const FOREIGN_COMMONWEALTH_OFFICE = '#003e74'
export const FOREIGN_COMMONWEALTH_OFFICE_WEBSAFE = '#406e97'
export const GOVERNMENT_EQUALITIES_OFFICE = '#9325b2'
export const HM_GOVERNMENT = '#0076c0'
export const HM_GOVERNMENT_WEBSAFE = '#347da4'
export const HM_REVENUE_CUSTOMS = '#009390'
export const HM_REVENUE_CUSTOMS_WEBSAFE = '#008770'
export const HM_TREASURY = '#af292e'
export const HM_TREASURY_WEBSAFE = '#832322'
export const HOME_OFFICE = '#9325b2'
export const HOME_OFFICE_WEBSAFE = '#9440b2'
export const MINISTRY_OF_DEFENCE = '#4d2942'
export const MINISTRY_OF_DEFENCE_WEBSAFE = '#5a5c92'
export const MINISTRY_OF_JUSTICE = '#231f20'
export const MINISTRY_OF_JUSTICE_WEBSAFE = '#5a5c92'
export const NORTHERN_IRELAND_OFFICE = '#002663'
export const OFFICE_OF_THE_ADVOCATE_GENERAL_FOR_SCOTLAND = '#002663'
export const OFFICE_OF_THE_ADVOCATE_GENERAL_FOR_SCOTLAND_WEBSAFE = LINK_COLOUR
export const OFFICE_OF_THE_LEADER_OF_THE_HOUSE_OF_LORDS = '#9c132e'
export const OFFICE_OF_THE_LEADER_OF_THE_HOUSE_OF_LORDS_WEBSAFE = '#c2395d'
export const SCOTLAND_OFFICE = '#002663'
export const SCOTLAND_OFFICE_WEBSAFE = '#405c8a'
export const THE_OFFICE_OF_THE_LEADER_OF_THE_HOUSE_OF_COMMONS = '#317023'
export const THE_OFFICE_OF_THE_LEADER_OF_THE_HOUSE_OF_COMMONS_WEBSAFE =
  '#005f8f'
export const UK_EXPORT_FINANCE = '#005747'
export const UK_EXPORT_FINANCE_WEBSAFE = LINK_COLOUR
export const UK_TRADE_INVESTMENT = '#c80651'
export const UK_TRADE_INVESTMENT_WEBSAFE = LINK_COLOUR
export const WALES_OFFICE = '#a33038'
export const WALES_OFFICE_WEBSAFE = '#7a242a'
