import React from 'react'
import styled from 'styled-components'
import { SPACING, BORDER_WIDTH_MOBILE } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import Checkbox from '@govuk-react/checkbox'

import { WHITE } from '../../../client/utils/colours'

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  min-height: 26px;
  margin-bottom: 0;

  & > span {
    margin: 0;
    padding: 0;
    white-space: nowrap;

    &::before {
      background: ${WHITE};
      width: 26px;
      height: 26px;
    }

    &::after {
      top: 6px;
      left: ${SPACING.SCALE_1};
      width: 12px;
      height: 6px;
      box-sizing: unset;
      border-width: 0 0 ${BORDER_WIDTH_MOBILE} ${BORDER_WIDTH_MOBILE};
    }
  }

  input {
    width: 26px;
    height: 26px;
    margin: 0;
    padding: 0;
  }
`

const ActivityFeedCheckbox = ({ children, ...rest }) => {
  return <StyledCheckbox {...rest}>{children}</StyledCheckbox>
}

ActivityFeedCheckbox.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
}

export default ActivityFeedCheckbox
