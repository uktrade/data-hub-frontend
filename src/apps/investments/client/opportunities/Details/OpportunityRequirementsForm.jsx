import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'

import { currencyGBP } from '../../../../../client/utils/number-utils'

import { TASK_SAVE_OPPORTUNITY_REQUIREMENTS, ID } from './state'

import { INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE } from '../../../../../client/actions'

import Task from '../../../../../client/components/Task'
import {
  Main,
  Step,
  FieldInput,
  FormStateful,
} from '../../../../../client/components'
import { 
  TOTAL_INVESTMENT_SOUGHT_FIELD_NAME,
  CURRENT_INVESTMENT_SECURED_FIELD_NAME,
  INVESTMENT_TYPES_FIELD_NAME,
  ESTIMATED_RETURN_RATE_FIELD_NAME,
  TIME_HORIZONS_FIELD_NAME,
} from '../Details/constants'

const FormatInitialValue = (val) => {
  return val == null ? '£ ' : currencyGBP(val)
}

const OpportunityRequirementsForm = (props) => {
  const { opportunityId, formInitialValues } = props
  const { details } =  useSelector(state => state[ID], shallowEqual)
  const {
    totalInvestmentSought,
    currentInvestmentSecured,
  } = details.requirementsFields

  return (
    <Task>
      {(getTask) => (
        <FormStateful
          initialValues={formInitialValues}
          onSubmit={(values) => {
            getTask(TASK_SAVE_OPPORTUNITY_REQUIREMENTS, ID).start({
              payload: {
                values,
                opportunityId,
              },
              onSuccessDispatch: INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE,
            })
            return null
          }}
        >
          {() => (
            <>
              <Main>
                <Task.Status name={TASK_SAVE_OPPORTUNITY_REQUIREMENTS} id={ID} />
                <Step name="updateOpportunityRequirements">
                  <FieldInput
                    label="Total investment sought"
                    hint="Enter value in GB pounds"
                    name={TOTAL_INVESTMENT_SOUGHT_FIELD_NAME}
                    // initialValue={FormatInitialValue(totalInvestmentSought)}
                    initialValue={currencyGBP(0)}
                    type="text"
                    required="Please enter a value to continue"
                  />

                  <FieldInput
                    label="Investment secured so far"
                    hint="Enter value in GB pounds"
                    name={CURRENT_INVESTMENT_SECURED_FIELD_NAME}
                    initialValue={FormatInitialValue(currentInvestmentSecured)}
                    type="text"
                    required="Please enter a value to continue"
                  />

                </Step>
              </Main>
            </>
          )}
        </FormStateful>
      )}
    </Task>
  )
}

OpportunityRequirementsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default OpportunityRequirementsForm
