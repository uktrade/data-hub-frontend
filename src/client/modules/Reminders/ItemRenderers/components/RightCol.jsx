import { MEDIA_QUERIES } from '@govuk-react/constants'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'

const RightCol = styled(GridCol)({
  display: 'none',
  textAlign: 'right',
  [MEDIA_QUERIES.TABLET]: {
    display: 'block',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'block',
  },
})

export default RightCol
