import Table from '@govuk-react/table'
import styled from 'styled-components'
import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { typography } from '@govuk-react/lib'
import { SPACING, FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'

import { GREY_1, GREY_2 } from '../../utils/colours'

const StyledTable = styled(Table)`
  & > caption {
    ${typography.font({ size: 24, weight: 'bold' })};
    margin-bottom: ${SPACING.SCALE_2};
    padding-bottom: ${SPACING.SCALE_2};
    border-bottom: 1px solid ${GREY_2};
  }
  & > caption > * {
    ${typography.font({ size: 19, weight: 'normal' })};
    float: right;
    margin-left: ${SPACING.SCALE_3};
  }
  margin: 0;
  margin-bottom: 34px;

  & > tbody {
    display: grid;
    grid-auto-rows: auto;

    grid-template-columns: 1fr;
    ${MEDIA_QUERIES.TABLET} {
      grid-template-columns: 1fr 1fr;
    }
  }

  .highlight-row:nth-child(odd) {
    ${MEDIA_QUERIES.TABLET} {
      padding-right: 10px;
    }
  }
  .highlight-row:nth-child(even) {
    ${MEDIA_QUERIES.TABLET} {
      padding-left: 10px;
    }
  }
`

const StyledCellList = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
`

const SummaryTableHighlight = ({ caption, actions, children, ...rest }) => (
  <StyledTable
    caption={caption && [caption, actions]}
    {...rest}
    data-component="SummaryTable"
  >
    {children}
  </StyledTable>
)

const StyledTableHighlightRow = styled(Table.Row)`
  display: flex;
  flex-direction: column;
  border: none;
  border-bottom: 1px solid ${GREY_2};
  padding: 20px 0;
  margin-bottom: 25px;
  grid-column: 1/-1;
  ${MEDIA_QUERIES.TABLET} {
    grid-column: ${(props) => (props.$isHalf ? 'span 1' : '1/-1')};
  }
`

const StyledTableRow = styled(Table.Row)({
  padding: '10px 0px',
  gridColumn: 'span 2',
  border: 'none',
  display: 'grid',
  columnGap: '10px',
  gridTemplateColumns: '.7fr 1fr',
  borderBottom: `1px solid ${GREY_2}`,
})

const StyledTableHighlightHeaderCell = styled(Table.CellHeader)({
  borderBottom: 'none',
  padding: '0',
})

const StyledTableHighlightHalfHeaderCell = styled(Table.CellHeader)({
  fontSize: FONT_SIZE.SIZE_19,
  color: GREY_1,
  fontWeight: 'normal',
  border: 'none',
  padding: '0',
  paddingBottom: '5px',
})

const StyledTableHeaderCell = styled(Table.Cell)({
  border: 'none',
  fontWeight: 'normal',
  padding: '0',
  wordBreak: 'break-word',
})

const StyledTableHighlightHalfCell = styled(Table.Cell)({
  fontWeight: '700',
  fontSize: '36px',
  lineHeight: '40px',
  padding: '0',
  border: 'none',
  wordBreak: 'break-word',
})

SummaryTableHighlight.HighlightRow = ({
  heading,
  children,
  hideWhenEmpty,
  isHalf = true,
  ...props
}) => {
  if (hideWhenEmpty && isEmpty(children)) {
    return null
  }

  return (
    <StyledTableHighlightRow
      className="highlight-row"
      $isHalf={isHalf}
      {...props}
    >
      {heading && (
        <StyledTableHighlightHalfHeaderCell>
          {heading}
        </StyledTableHighlightHalfHeaderCell>
      )}
      <StyledTableHighlightHalfCell>{children}</StyledTableHighlightHalfCell>
    </StyledTableHighlightRow>
  )
}

SummaryTableHighlight.Row = ({
  heading,
  children,
  hideWhenEmpty,
  ...props
}) => {
  if (hideWhenEmpty && isEmpty(children)) {
    return null
  }

  const renderChildren = () => {
    if (Array.isArray(children)) {
      return (
        <StyledCellList {...props}>
          {children
            .filter((c) => c)
            .map((c, index) => (
              <li key={`${c}-${index}`}>{c}</li>
            ))}
        </StyledCellList>
      )
    }

    return children
  }

  return (
    <StyledTableRow {...props}>
      {heading && (
        <StyledTableHighlightHeaderCell>
          {heading}
        </StyledTableHighlightHeaderCell>
      )}
      <StyledTableHeaderCell>{renderChildren()}</StyledTableHeaderCell>
    </StyledTableRow>
  )
}

SummaryTableHighlight.propTypes = {
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  actions: PropTypes.node,
  children: PropTypes.node,
}

SummaryTableHighlight.Row.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
  hideWhenEmpty: PropTypes.bool,
}

SummaryTableHighlight.HighlightRow.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
  hideWhenEmpty: PropTypes.bool,

  // When true (default), highlight takes half the grid allowing you to show two highlights on one row. When
  // false, highlight takes up full row.
  isHalf: PropTypes.bool,
}

SummaryTableHighlight.HighlightRow.defaultProps = {
  isHalf: true,
}

export default SummaryTableHighlight
