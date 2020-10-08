/* istanbul ignore file */
import {
  BLUE,
  YELLOW,
  BLACK,
  WHITE,
  GREY_1,
  GREY_2,
  GREY_3,
  GREY_4,
  ERROR_COLOUR,
} from 'govuk-colours'
import {
  SPACING,
  MEDIA_QUERIES,
  FONT_SIZE,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

const defaultStyles = {
  option: (styles, { isFocused }) => ({
    ...styles,
    fontSize: FONT_SIZE.SIZE_16,
    fontWeight: FONT_WEIGHTS.regular,
    borderBottom: `1px solid ${BLACK}`,
    borderRadius: 0,
    paddingTop: SPACING.SCALE_3,
    paddingBottom: SPACING.SCALE_3,
    color: isFocused ? WHITE : BLACK,
    backgroundColor: isFocused ? BLUE : WHITE,
    [MEDIA_QUERIES.TABLET]: {
      fontSize: FONT_SIZE.SIZE_19,
    },
    '&:last-of-type': {
      borderBottom: 0,
    },
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    fontSize: FONT_SIZE.SIZE_19,
    color: GREY_1,
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    borderRadius: 0,
    'input:focus': { boxShadow: 'none' },
    outline: isFocused ? `3px solid ${YELLOW}` : styles.outline,
    border: `2px solid ${BLACK}`,
    '&:hover': {
      border: styles.border,
    },
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: 0,
    borderRadius: 0,
    border: `1px solid ${BLACK}`,
    borderTop: 0,
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: FONT_SIZE.SIZE_16,
    color: GREY_1,
    [MEDIA_QUERIES.TABLET]: {
      fontSize: FONT_SIZE.SIZE_19,
    },
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    backgroundColor: GREY_4,
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    backgroundColor: GREY_3,
    '&:hover': {
      backgroundColor: GREY_2,
      cursor: 'pointer',
    },
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    padding: 0,
    svg: {
      color: BLACK,
      width: '17px',
      height: '17px',
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: WHITE,
  }),
}

export const errorStyles = {
  ...defaultStyles,
  control: (...args) => ({
    ...defaultStyles.control(...args),
    border: `4px solid ${ERROR_COLOUR}`,
  }),
}

export default defaultStyles
