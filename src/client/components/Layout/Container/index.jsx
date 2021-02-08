import styled from 'styled-components'

import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

const Container = styled('div')`
  max-width: 1200px;
  padding: ${SPACING.SCALE_3} 0;
  margin: 0 ${SPACING.SCALE_3};
  ${MEDIA_QUERIES.TABLET} {
    padding: ${SPACING.SCALE_5} 0;
    margin: 0 ${SPACING.SCALE_5};
  }
  ${MEDIA_QUERIES.DESKTOP} {
    padding: ${SPACING.SCALE_6} 0;
  }
  @media only screen and (min-width: 1200px) {
    margin: 0 auto;
  }
`

export default Container
