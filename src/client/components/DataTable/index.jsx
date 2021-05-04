import React from 'react'
import PropTypes from 'prop-types'
import { default as GovTable } from '@govuk-react/table'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

const StyledGovTable = styled(GovTable)`
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: 23px;
`

const StyledGovTableCellHeader = styled(GovTable.CellHeader)`
  font-weight: normal;
  font-size: 15px;
`

const StyledGovTableCell = styled(GovTable.Cell)`
  padding: 6px 0 6px 0;
  line-height: 1.7;
`

const DataTable = ({ data, headers }) => (
  <StyledGovTable data-test="investment-project-table">
    <GovTable.Row>
      {headers.map((header, i) => (
        <StyledGovTableCellHeader setWidth={i === 0 ? '40%' : '60%'} key={i}>
          {header}
        </StyledGovTableCellHeader>
      ))}
    </GovTable.Row>
    {data.map(({ id, label, value, link }) => (
      <GovTable.Row key={id}>
        <StyledGovTableCell>
          {link ? (
            <a href={link} title={`View ${label}`}>
              {label}
            </a>
          ) : (
            label
          )}
        </StyledGovTableCell>
        <StyledGovTableCell>{value}</StyledGovTableCell>
      </GovTable.Row>
    ))}
  </StyledGovTable>
)

DataTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  headers: PropTypes.array.isRequired,
}

export default DataTable
