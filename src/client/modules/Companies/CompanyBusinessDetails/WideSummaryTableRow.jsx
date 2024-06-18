import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import React from 'react'
import Table from '@govuk-react/table'

const StyledTableRow = styled(Table.Cell)`
  ${({ addPadding }) => addPadding && `padding-top: ${SPACING_POINTS[6]}px;`}
`

const WideSummaryTableRow = ({ children, addPadding }) => (
  <Table.Row>
    <StyledTableRow addPadding={addPadding} colSpan={2}>
      {children}
    </StyledTableRow>
  </Table.Row>
)

WideSummaryTableRow.propTypes = {
  children: PropTypes.node.isRequired,
  addPadding: PropTypes.bool,
}

export default WideSummaryTableRow
