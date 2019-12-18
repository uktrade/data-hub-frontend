import { LEVEL_SIZE, SPACING } from '@govuk-react/constants'
import { H2 } from '@govuk-react/heading'
import Select from '@govuk-react/select'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import * as propTypes from './propTypes'

const StyledRoot = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledHeading = styled(H2)({
  flexGrow: 1,
})

const StyledSelect = styled(Select)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  marginRight: 0,
  span: {
    marginRight: SPACING.SCALE_2,
  },
  // We need to override the select style because it has a hardcoded 50% width.
  select: {
    width: 'initial',
    minWidth: 200,
  },
})

export const Header = ({ lists, onChange }) =>
  <StyledRoot>
    <StyledHeading size={LEVEL_SIZE[3]}>
      My companies lists
    </StyledHeading>
    {lists.length > 1 &&
      <StyledSelect
        label="View list"
        input={{ onChange: e => onChange(e.target.value) }}
      >
        {lists.map(({ name }, idx) => (
          <option key={idx} value={idx}>
            {name}
          </option>
        ))}
      </StyledSelect>
    }
  </StyledRoot>

Header.propTypes = {
  lists: propTypes.lists,
  onChange: PropTypes.func,
}

export default Header
