import Table from '@govuk-react/table'
import styled from 'styled-components'
import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { typography } from '@govuk-react/lib'
import {
  SPACING,
  FONT_SIZE,
  LINE_HEIGHT,
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
} from '@govuk-react/constants'

import { GREY_2, ERROR_COLOUR } from '../../../client/utils/colours'
import { currencyGBP } from '../../utils/number-utils'
import Tag from '../Tag'

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

const StyledTag = styled(Tag)`
  float: right;
`

const SummaryTable = ({ caption, actions, children, ...rest }) => (
  <StyledTable caption={caption && [caption, actions]} {...rest}>
    {children}
  </StyledTable>
)

const StyledTableRow = styled(Table.Row)`
  font-size: ${FONT_SIZE.SIZE_16};
  line-height: ${LINE_HEIGHT.SIZE_24};
  white-space: pre-wrap;

  /* Conditionally apply the red border when flag is false */
  ${(props) =>
    props.invalid &&
    `
      border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
      margin-right: ${SPACING.SCALE_3};
      padding-left: ${SPACING.SCALE_2};
    `}
`

SummaryTable.Row = ({ heading, children, hideWhenEmpty, flag }) => {
  if (hideWhenEmpty && isEmpty(children)) {
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
    <StyledTableRow invalid={flag}>
      {heading && <Table.CellHeader>{heading}</Table.CellHeader>}
      <Table.Cell>{renderChildren()}</Table.Cell>
    </StyledTableRow>
  )
}

SummaryTable.TextRow = ({ heading, value }) => (
  <SummaryTable.Row heading={heading}>
    {value ? value : <StyledTag>incomplete</StyledTag>}
  </SummaryTable.Row>
)

SummaryTable.CurrencyRow = ({ heading, value }) => (
  <SummaryTable.Row heading={heading}>
    {value ? currencyGBP(value) : <StyledTag>incomplete</StyledTag>}
  </SummaryTable.Row>
)

SummaryTable.ListRow = ({ heading, value, emptyValue, ...rest }) => (
  <SummaryTable.Row heading={heading} {...rest}>
    {value && value.length ? (
      <ul>
        {value.map((v, i) => (
          <li key={`${heading}-${i}`}>{v.label}</li>
        ))}
      </ul>
    ) : emptyValue === undefined ? (
      <StyledTag>incomplete</StyledTag>
    ) : (
      emptyValue
    )}
  </SummaryTable.Row>
)

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

SummaryTable.TextRow.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.string,
}

SummaryTable.TextRow.defaultProps = {
  heading: null,
  value: null,
}

SummaryTable.CurrencyRow.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.number,
}

SummaryTable.CurrencyRow.defaultProps = {
  heading: null,
  value: null,
}

SummaryTable.ListRow.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
}

SummaryTable.ListRow.defaultProps = {
  heading: null,
  value: [],
}

export default SummaryTable
