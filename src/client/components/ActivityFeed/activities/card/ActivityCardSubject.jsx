import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import styled from 'styled-components'
// import Link from '@govuk-react/link'

import { BLUE } from '../../../../../client/utils/colours'

const StyledActivitySubject = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: ${({ margin }) => `${margin.top}px`};
  margin-bottom: ${({ margin }) => `${margin.bottom}px`};
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

const ActivityCardSubject = ({
  children,
  // url,
  // linkDataTest,
  // isOverview,
  dataTest = 'activity-card-subject',
  margin = { top: 10, bottom: 10 },
}) => (
  <StyledActivitySubject data-test={dataTest} margin={margin}>
    {children}
  </StyledActivitySubject>
)
// }) => {
//   return isOverview ? (
//     <StyledActivitySubject data-test={dataTest}>
//       <Link dataTest={linkDataTest} href={url}>
//         {children}
//       </Link>
//     </StyledActivitySubject>
//   ) : (
//     <StyledActivitySubjectSquash data-test={dataTest}>
//       <Link dataTest={linkDataTest} href={url}>
//         {children}
//       </Link>
//     </StyledActivitySubjectSquash>
//   )
// }

ActivityCardSubject.propTypes = {
  children: PropTypes.node.isRequired,
  dataTest: PropTypes.string,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
  }),
}
ActivityCardSubject.defaultProps = {
  isOverview: false,
}

export default ActivityCardSubject
