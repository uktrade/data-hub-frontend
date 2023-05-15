import React from 'react'
import styled from 'styled-components'
import { BLUE, DARK_BLUE_LEGACY } from '../../../client/utils/colours'
import { FONT_SIZE } from '@govuk-react/constants'
import { connect } from 'react-redux'
import { state2props } from '../CompanyLists/state'
import Task from '../Task'
import { COMPANY_LISTS__LISTS_LOADED } from '../../actions'

const StyledCompanyListItemButton = styled('button')`
  display: inline-table;
  padding: 8px;
  background-color: ${BLUE};
  border: none;
  border-bottom: 5px solid ${DARK_BLUE_LEGACY};
  vertical-align: middle;
  cursor: pointer;
  span {
    pointer-events: none;
    display: table-cell;
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

export const LocalHeaderCompanyLists = ({ lists }) => (
  <Task.Status
    name="Company lists"
    id="local-header"
    progressMessage="Loading my companies lists"
    startOnRender={{ onSuccessDispatch: COMPANY_LISTS__LISTS_LOADED }}
  >
    {() =>
      lists && (
        <>
          {Object.keys(lists).map((key) => (
            <StyledCompanyListItemButton key={key}>
              {lists[key].name}
            </StyledCompanyListItemButton>
          ))}
        </>
      )
    }
  </Task.Status>
)

export default connect(state2props)(LocalHeaderCompanyLists)
