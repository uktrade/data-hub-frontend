export const TAG_COLOURS = {
  GREY: 'grey',
  GREEN: 'green',
  TURQUOISE: 'turquoise',
  BLUE: 'blue',
  LIGHT_BLUE: 'lightBlue',
  PURPLE: 'purple',
  PINK: 'pink',
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  DARK_GREEN: 'darkGreen',
  GOV_BLUE: 'govBlue',
}

// Defined by the GOV.UK Design System
// https://design-system.service.gov.uk/components/tag/
const TAG_COLOUR_MAP = {
  [TAG_COLOURS.GREY]: {
    colour: '#282d30',
    backgroundColour: '#e5e6e7',
  },
  [TAG_COLOURS.GREEN]: {
    colour: '#005a30',
    backgroundColour: '#cce2d8',
  },
  [TAG_COLOURS.TURQUOISE]: {
    colour: '#10403c',
    backgroundColour: '#d4ecea',
  },
  [TAG_COLOURS.BLUE]: {
    colour: '#0c2d4a',
    backgroundColour: '#bbd4ea',
  },
  [TAG_COLOURS.LIGHT_BLUE]: {
    colour: '#0c2d4a',
    backgroundColour: '#e8f1f8',
  },
  [TAG_COLOURS.PURPLE]: {
    colour: '#491644',
    backgroundColour: '#efdfed',
  },
  [TAG_COLOURS.PINK]: {
    colour: '#6b1c40',
    backgroundColour: '#f9e1ec',
  },
  [TAG_COLOURS.RED]: {
    colour: '#2a0b06',
    backgroundColour: '#f4cdc6',
  },
  [TAG_COLOURS.ORANGE]: {
    colour: '#6e3619',
    backgroundColour: '#fcd6c3',
  },
  [TAG_COLOURS.YELLOW]: {
    colour: '#594d00',
    backgroundColour: '#fff7bf',
  },
  // Custom colours for extended use
  [TAG_COLOURS.DARK_GREEN]: {
    colour: '#ffffff',
    backgroundColour: '#10403c',
  },
  [TAG_COLOURS.GOV_BLUE]: {
    colour: '#ffffff',
    backgroundColour: '#1d70b8',
  },
}

export default TAG_COLOUR_MAP
