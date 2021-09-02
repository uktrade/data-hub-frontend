import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { BLUE } from 'govuk-colours'
import { connect } from 'react-redux'

import { rgba } from '../../utils/colors'
import { DATA_SUMMARY__ACCESSIBLE_TOGGLE } from '../../actions'

import PieChart from '../PieChart'
import DataTable from '../DataTable'

import { state2props } from './state'

const StyledContainer = styled('div')`
  padding-top: ${SPACING.SCALE_1};
`

const StyledHeader = styled('h3')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledButton = styled('button')`
  border: 0;
  padding: 0;
  color: ${BLUE};
  cursor: pointer;
  background: none;
  text-decoration: underline;
  font-size: ${FONT_SIZE.SIZE_16};
`

const StyledProjectContainer = styled('div')`
  width: 154px;
  margin-top: 18px;
  box-sizing: border-box;
  background-color: ${rgba(BLUE, 0.25)};
  padding: ${SPACING.SCALE_2};
  font-size: ${FONT_SIZE.SIZE_16};
`

const StyledDiv = styled('div')`
  text-align: center;
  padding: 2px;
  font-size: ${FONT_SIZE.SIZE_14};
`

const StyledYear = styled(StyledDiv)``

const StyledTotal = styled(StyledDiv)`
  font-weight: ${FONT_WEIGHTS.bold};
  font-size: ${FONT_SIZE.SIZE_24};
`

const StyledSubject = styled(StyledDiv)`
  font-weight: ${FONT_WEIGHTS.bold};
`

const DataSummary = ({
  title,
  subject,
  accessible,
  onToggleAccessible = () => {},
  headers,
  data = [],
  yearText,
  children,
}) => {
  const total = data.reduce((prev, curr) => prev + curr.value, 0)
  const chartData = data.map(({ label, value }) => ({
    id: label,
    label: `${label} (${value})`,
    value,
  }))

  return (
    <StyledContainer>
      {title && <StyledHeader>{title}</StyledHeader>}
      {children}
      {total > 0 && (
        <StyledButton onClick={onToggleAccessible} data-test="toggle-views">
          {accessible
            ? 'Change to chart view'
            : 'Change to table and accessible view'}
        </StyledButton>
      )}
      {accessible || total === 0 ? (
        <>
          <StyledProjectContainer data-test="investment-project-total">
            <StyledYear>{yearText} year</StyledYear>
            <StyledTotal>{total}</StyledTotal>
            <StyledSubject>{pluralize(subject, total)}</StyledSubject>
          </StyledProjectContainer>
          <DataTable data={data} headers={headers} />
        </>
      ) : (
        <PieChart data={chartData} height={420} />
      )}
    </StyledContainer>
  )
}

DataSummary.propTypes = {
  title: PropTypes.string,
  accessible: PropTypes.bool,
  onToggleAccessible: PropTypes.func,
  subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  yearText: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  children: PropTypes.node,
}

export default connect(state2props, (dispatch) => ({
  onToggleAccessible: () => {
    dispatch({
      type: DATA_SUMMARY__ACCESSIBLE_TOGGLE,
    })
  },
}))(DataSummary)
