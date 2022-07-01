import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

const ActivityList = styled('ol')`
  list-style-type: none;
  margin-top: ${SPACING.SCALE_2};

  & > li {
    margin-bottom: ${SPACING.SCALE_2};
  }
`
export default ActivityList
