import React from 'react'
import styled from 'styled-components'
import {
  DARK_BLUE_LEGACY,
  GREY_3,
  GREY_3_LEGACY,
  LIGHT_BLUE_25,
} from '../../../client/utils/colours'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { connect } from 'react-redux'
import Task from '../Task'
import { COMPANY_LISTS__COMPANY_IN_LOADED } from '../../actions'
import { ID, TASK_GET_LISTS_COMPANY_IS_IN, state2props } from './state'
import { kebabCase } from 'lodash'

const StyledCompanyListButton = styled('button')`
  display: inline-table;
  padding: 4px 8px 4px 8px;
  border: none;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 10px;
  font-size: ${FONT_SIZE.SIZE_14};
  span {
    pointer-events: none;
    display: inline-block;
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

const StyledCompanyListItemButton = styled(StyledCompanyListButton)`
  background-color: ${LIGHT_BLUE_25};
  color: ${DARK_BLUE_LEGACY};
  border-bottom: 3px solid ${DARK_BLUE_LEGACY};
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledAddButton = styled(StyledCompanyListButton)`
  background-color: ${GREY_3};
  border-bottom: 3px solid ${GREY_3_LEGACY};
`

export const LocalHeaderCompanyLists = ({ results, company, returnUrl }) => {
  const queryString = returnUrl ? `${returnUrl}` : `/companies/${company.id}`
  const handleClickAddRemove = () => {
    window.location.href = `/companies/${company.id}/lists/add-remove?returnUrl=${queryString}`
  }
  return (
    <Task.Status
      name={TASK_GET_LISTS_COMPANY_IS_IN}
      id={ID}
      progressMessage="Loading my lists"
      startOnRender={{
        payload: { id: company.id },
        onSuccessDispatch: COMPANY_LISTS__COMPANY_IN_LOADED,
      }}
    >
      {() =>
        results && (
          <>
            {Object.keys(results).map((list) => (
              <StyledCompanyListItemButton
                key={list}
                data-test={`list-item-${kebabCase(results[list].name)}-button`}
                onClick={handleClickAddRemove}
              >
                {results[list].name} <span>x</span>
              </StyledCompanyListItemButton>
            ))}
            <StyledAddButton
              data-test="add-to-list-button"
              onClick={handleClickAddRemove}
            >
              <span>+</span> Add to list
            </StyledAddButton>
          </>
        )
      }
    </Task.Status>
  )
}

export default connect(state2props)(LocalHeaderCompanyLists)
