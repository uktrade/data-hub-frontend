import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'
import Button from '@govuk-react/button'
import {
  BODY_SIZES,
  HEADING_SIZES,
  SPACING,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

import PieChart from 'PieChart'
import DataTable from '../../../client/components/DataTable'

const StyledHeader = styled('h3')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const TotalHeader = styled('h3')`
  font-weight: ${FONT_WEIGHTS.bold};
  display: table;
  line-height: 40px;
  margin-bottom: ${SPACING.SCALE_5};
`

const StyledTotal = styled('span')`
  font-size: ${HEADING_SIZES.XLARGE}px;
  display: table-cell;
  padding: 0 ${SPACING.SCALE_1} 0 0;
`
const StyledTotalSubject = styled('span')`
  vertical-align: top;
  font-size: ${BODY_SIZES.SMALL}px;
  line-height: 16px;
`

const StyledButton = styled(Button)`
  margin-bottom: ${SPACING.SCALE_3};
`

const DataSummary = ({
  title,
  subject,
  accessible,
  onToggleAccessible = () => {},
  headers,
  data = [],
  children,
}) => {
  const total = data.reduce((prev, curr) => prev + curr.value, 0)
  const chartData = data.map(({ label, value }) => ({
    id: label,
    label,
    value,
  }))

  return (
    <>
      <StyledHeader>{title}</StyledHeader>
      {children}
      <TotalHeader>
        <StyledTotal>{total}</StyledTotal>
        <StyledTotalSubject> {pluralize(subject, total)}</StyledTotalSubject>
      </TotalHeader>
      {total > 0 && (
        <StyledButton onClick={onToggleAccessible}>
          {accessible ? 'Change to chart view' : 'Change to accessible view'}
        </StyledButton>
      )}
      {accessible || total === 0 ? (
        <DataTable data={data} headers={headers} total={total} />
      ) : (
        <PieChart data={chartData} height={450} />
      )}
    </>
  )
}

DataSummary.propTypes = {
  title: PropTypes.string.isRequired,
  accessible: PropTypes.bool,
  onToggleAccessible: PropTypes.func,
  subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
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

export default DataSummary
