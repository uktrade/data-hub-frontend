import React from 'react'
import Button from '@govuk-react/button'
import InputField from '@govuk-react/input-field'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import multiInstance from '../../utils/multiinstance'

import {
  CREATE_UK_INVESTMENT_OPPORTUNITY__CHANGE,
  CREATE_UK_INVESTMENT_OPPORTUNITY__SUBMIT,
  CREATE_UK_INVESTMENT_OPPORTUNITY__SUCCESS,
} from '../../actions'
import { FormActions, ErrorSummary } from '..'
import Task from '../Task'
import TaskLoadingBox from '../Task/LoadingBox'
import HardRedirect from '../HardRedirect'
import ReferrerLink from '../ReferrerLink'

const TASK_NAME = 'CREATE_INVESTMENT_OPPORTUNITY'

const StyledInputField = styled(InputField)({
  marginBottom: SPACING.SCALE_5,
})

const CreateUKInvestmentOpportunity = ({
  error,
  newOpportunityId,
  dispatch,
  id,
  name = '',
}) => (
  <Task>
    {(t) => {
      const task = t(TASK_NAME, id)

      return (
        <HardRedirect
          to={`/investments/opportunities/${newOpportunityId}/details`}
          when={newOpportunityId}
        >
          <TaskLoadingBox name={TASK_NAME} id={id} when={newOpportunityId}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const name = e.target.name.value
                dispatch({
                  type: CREATE_UK_INVESTMENT_OPPORTUNITY__SUBMIT,
                  name,
                })

                if (name) {
                  task.start({
                    payload: name,
                    onSuccessDispatch: CREATE_UK_INVESTMENT_OPPORTUNITY__SUCCESS,
                  })
                }
              }}
            >
              {error && (
                <ErrorSummary
                  heading="There is a problem"
                  errors={[
                    {
                      text: error,
                      targetName: 'name',
                    },
                  ]}
                />
              )}
              <StyledInputField
                meta={
                  error && {
                    touched: true,
                    error: error,
                  }
                }
                input={{
                  value: name,
                  name: 'name',
                  id: 'field-name',
                  onChange: (e) =>
                    dispatch({
                      type: CREATE_UK_INVESTMENT_OPPORTUNITY__CHANGE,
                      name: e.target.value,
                    }),
                }}
              >
                Opportunity name
              </StyledInputField>
              <FormActions>
                <Button>Save</Button>
                <ReferrerLink>Cancel</ReferrerLink>
              </FormActions>
            </form>
          </TaskLoadingBox>
        </HardRedirect>
      )
    }}
  </Task>
)

export default multiInstance({
  name: 'CreateUKInvestmentOpportunity',
  actionPattern: 'CREATE_UK_INVESTMENT_OPPORTUNITY__',
  component: CreateUKInvestmentOpportunity,
  reducer: (state = {}, { type, name, result }) => {
    switch (type) {
      case CREATE_UK_INVESTMENT_OPPORTUNITY__CHANGE:
        return { ...state, name }
      case CREATE_UK_INVESTMENT_OPPORTUNITY__SUBMIT:
        return name
          ? { name }
          : { ...state, error: 'Enter an opportunity name' }
      case CREATE_UK_INVESTMENT_OPPORTUNITY__SUCCESS:
        return { ...state, newOpportunityId: result }
      default:
        return state
    }
  },
})
