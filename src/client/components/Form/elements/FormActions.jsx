import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

const FormActions = styled('div')`
  ${MEDIA_QUERIES.TABLET} {
    * {
      vertical-align: baseline;
    }

    * + * {
      margin-left: ${SPACING.SCALE_4};
    }
  }
`

export default FormActions
