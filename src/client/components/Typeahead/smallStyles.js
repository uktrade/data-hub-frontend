import { BLACK } from 'govuk-colours'
import { MEDIA_QUERIES, FONT_SIZE } from '@govuk-react/constants'
import styles from './styles'

const smallStyles = {
  option: (...args) => ({
    ...styles.option(...args),
    [MEDIA_QUERIES.TABLET]: {
      fontSize: FONT_SIZE.SIZE_16,
    },
  }),
  noOptionsMessage: (...args) => ({
    ...styles.noOptionsMessage(...args),
    fontSize: FONT_SIZE.SIZE_16,
  }),
  control: (...args) => ({
    ...styles.control(...args),
    border: `1px solid ${BLACK}`,
  }),
  placeholder: (...args) => ({
    ...styles.placeholder(...args),
    [MEDIA_QUERIES.TABLET]: {
      fontSize: FONT_SIZE.SIZE_16,
    },
  }),
}

export default smallStyles
