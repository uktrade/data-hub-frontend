import React from 'react'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { connect } from 'react-redux'
import { kebabCase } from 'lodash'

import {
  DARK_BLUE_LEGACY,
  GREY_3,
  GREY_3_LEGACY,
  LIGHT_BLUE_25,
} from '../../../client/utils/colours'

import Task from '../Task'
import { COMPANY_LISTS__COMPANY_IN_LOADED } from '../../actions'
import { ID, TASK_GET_LISTS_COMPANY_IS_IN, state2props } from './state'
import LocalHeaderCompanyRefer from './LocalHeaderCompanyRefer'
import urls from '../../../lib/urls'

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

export const LocalHeaderCompanyLists = ({ results, companyId }) => {
  const handleClickAddRemove = () => {
    window.location.href = `${urls.companies.lists.addRemove(
      companyId
    )}?returnUrl=${window.location.pathname}`
  }
  return (
    <Task.Status
      name={TASK_GET_LISTS_COMPANY_IS_IN}
      id={ID}
      progressMessage="Loading my lists"
      startOnRender={{
        payload: { id: companyId },
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
                aria-label={`${results[list].name}: click to add or remove list`}
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
            <LocalHeaderCompanyRefer companyId={companyId} />
          </>
        )
      }
    </Task.Status>
  )
}

export default connect(state2props)(LocalHeaderCompanyLists)
