import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { BLUE } from 'govuk-colours'
import { FOCUSABLE, SPACING } from '@govuk-react/constants'

const StatusMessage = styled('div')`
  border: ${({ colour }) => `${SPACING.SCALE_1} solid ${colour}`};
  color: ${({ colour }) => colour};
  font-weight: bold;
  line-height: 1.5;
  ${spacing.responsivePadding(4)};
  ${spacing.withWhiteSpace({ marginBottom: 6 })};
  ${FOCUSABLE};
`

StatusMessage.propTypes = {
  colour: PropTypes.string,
  children: PropTypes.node.isRequired,
}

StatusMessage.defaultProps = {
  colour: BLUE,
}

export default StatusMessage
