/**
 * Components shared across multiple cards
 */

import styled from 'styled-components'
import { Table } from 'govuk-react'
import { FONT_SIZE } from '@govuk-react/constants'

import { SummaryTable } from '../../../../components'
import { GREY_1 } from '../../../../utils/colours'
import AccessibleLink from '../../../../components/Link'

export const StyledTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
  padding-top: 0;
`

export const StyledLastTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`

export const StyledAccessibleLink = styled(AccessibleLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

export const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
  & > tbody th {
    width: 50%;
  }
`

export const StyledTableRow = styled(Table.Row)`
  border: 0;
`

export const StyledSpan = styled('span')`
  color: ${GREY_1};
`
