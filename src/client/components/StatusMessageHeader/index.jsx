import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { FOCUSABLE, SPACING } from '@govuk-react/constants'

import { BLUE } from '../../utils/colours'

const StatusMessageHeader = styled('div').attrs((props) => ({
  borderColour: props.borderColour || BLUE,
  textColour: props.textColour || BLUE,
  role: 'alert',
  'data-test': props['data-test'] || 'status-message-header',
}))`
  border: ${({ borderColour }) => `${SPACING.SCALE_1} solid ${borderColour}`};
  color: ${({ textColour }) => textColour};
  font-weight: bold;
  line-height: 1.5;
  ${spacing.responsivePadding(4)};
  ${spacing.withWhiteSpace({ marginBottom: 6 })};
  ${FOCUSABLE};
`

StatusMessageHeader.propTypes = {
  borderColour: PropTypes.string,
  textColour: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default StatusMessageHeader
