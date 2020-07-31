import Table from '@govuk-react/table'
import styled from 'styled-components'
import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { GREY_2 } from 'govuk-colours'
import { typography } from '@govuk-react/lib'
import { SPACING, FONT_SIZE, LINE_HEIGHT } from '@govuk-react/constants'

const StyledTable = styled(Table)`
  & > tbody th {
    width: 30%;
  }
  & > caption {
    ${typography.font({ size: 24, weight: 'bold' })};
    margin-bottom: ${SPACING.SCALE_4};
  }
  & > tbody > tr:first-child {
    border-top: 1px solid ${GREY_2};
  }
  & > caption > * {
    ${typography.font({ size: 19, weight: 'bold' })};
    float: right;
    margin-left: ${SPACING.SCALE_3};
  }
`

const StyledCellList = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
`

const SummaryTable = ({ caption, actions, children, ...rest }) => (
  <StyledTable caption={[caption, actions]} {...rest}>
    {children}
  </StyledTable>
)

const StyledTableRow = styled(Table.Row)`
  font-size: ${FONT_SIZE.SIZE_16};
  line-height: ${LINE_HEIGHT.SIZE_24};
`

SummaryTable.Row = ({ heading, children }) => {
  if (isEmpty(children)) {
    return null
  }

  const renderChildren = () => {
    if (Array.isArray(children)) {
      return (
        <StyledCellList>
          {children
            .filter((c) => c)
            .map((c) => (
              <li key={c}>{c}</li>
            ))}
        </StyledCellList>
      )
    }

    return children
  }

  return (
    <StyledTableRow>
      {heading && <Table.CellHeader>{heading}</Table.CellHeader>}
      <Table.Cell>{renderChildren()}</Table.Cell>
    </StyledTableRow>
  )
}

SummaryTable.propTypes = {
  caption: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
}

SummaryTable.defaultProps = {
  caption: null,
  actions: null,
  children: null,
}

SummaryTable.Row.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
}

SummaryTable.Row.defaultProps = {
  heading: null,
  children: null,
}

export default SummaryTable
