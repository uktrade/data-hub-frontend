import { BLUE, WHITE } from 'govuk-colours'

// Most of these colours aren't included as part of the govuk-colours package so we need to define them here. Currrently we only need them here, but we can lift them out into their own file if we start to use them elsewhere.
const TAG_COLOURS = {
  default: {
    colour: WHITE,
    background: BLUE,
  },
  grey: {
    colour: '#454a4d',
    background: '#eff0f1',
  },
  green: {
    colour: '#005a30',
    background: '#cce2d8',
  },
  turquoise: {
    colour: '#10403c',
    background: '#bfe3e0',
  },
  blue: {
    colour: '#144e81',
    background: '#d2e2f1',
  },
  purple: {
    colour: '#3d2375',
    background: '#dbd5e9',
  },
  pink: {
    colour: '#80224d',
    background: '#f7d7e6',
  },
  red: {
    colour: '#942514',
    background: '#f6d7d2',
  },
  orange: {
    colour: '#6e3619',
    background: '#fcd6c3',
  },
  yellow: {
    colour: '#594d00',
    background: '#fff7bf',
  },
}

export default TAG_COLOURS
