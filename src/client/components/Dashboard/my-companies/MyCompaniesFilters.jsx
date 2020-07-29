import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SelectInput } from '@govuk-react/select'
import Input from '@govuk-react/input'
import LabelText from '@govuk-react/label-text'
import Label from '@govuk-react/label'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import useMyCompaniesContext from './useMyCompaniesContext'
import { FILTER_CHANGE, ORDER_CHANGE } from './constants'

const StyledSelectInput = styled(SelectInput)({
  [MEDIA_QUERIES.LARGESCREEN]: { width: 'auto' },
})

const StyledInput = styled(Input)({
  width: 200,
  marginRight: SPACING.SCALE_6,
})

const StyledContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledLabel = styled(Label)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
})

const StyledLabelText = styled(LabelText)({
  marginRight: SPACING.SCALE_2,
})

const InlineLabel = ({ text, children }) => (
  <StyledLabel>
    <StyledLabelText>{text}</StyledLabelText>
    {children}
  </StyledLabel>
)

InlineLabel.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
}

InlineLabel.defaultProps = {
  children: null,
}

function MyCompaniesFilters() {
  const { dispatch } = useMyCompaniesContext()

  return (
    <StyledContainer>
      <InlineLabel text="Search this list">
        <StyledInput
          placeholder="Company name"
          onChange={(e) =>
            dispatch({ type: FILTER_CHANGE, filter: e.target.value })
          }
        />
      </InlineLabel>
      <InlineLabel text="Sort by">
        <StyledSelectInput
          onChange={(e) =>
            dispatch({ type: ORDER_CHANGE, sortBy: e.target.value })
          }
        >
          <option value="recent">Recent interaction</option>
          <option value="least-recent">Least recent interaction</option>
          <option value="alphabetical">Company name A-Z</option>
        </StyledSelectInput>
      </InlineLabel>
    </StyledContainer>
  )
}

export default MyCompaniesFilters
