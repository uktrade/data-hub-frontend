import styled from 'styled-components'

import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

const Container = styled('div')`
  margin: 0 ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.TABLET} {
    margin: 0 ${SPACING.SCALE_5};
  }

  @media only screen and (min-width: ${({ width }) => `${width}px`}) {
    margin: 0 auto;
    max-width: ${({ width }) => `${width}px`};
  }
`

export default Container
