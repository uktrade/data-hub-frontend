import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'

import { TASK_SAVE_OPPORTUNITY_REQUIREMENTS, ID, 
  TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA } from './state'

import { INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE } from '../../../../../client/actions'

import Task from '../../../../../client/components/Task'
import {
  Main,
  Step,
  FieldInput,
  FormStateful,
  FieldCheckboxes,
  FieldRadios,
} from '../../../../../client/components'
import { 
  TOTAL_INVESTMENT_SOUGHT_FIELD_NAME,
  CURRENT_INVESTMENT_SECURED_FIELD_NAME,
  INVESTMENT_TYPES_FIELD_NAME,
  ESTIMATED_RETURN_RATE_FIELD_NAME,
  TIME_HORIZONS_FIELD_NAME,
} from '../Details/constants'

const formatInitialValue = (value) => {
  return value == null ? '£' : value
}

const IS_NUMBER = /^[0-9]*$/ // Input validation to eliminates XSS

const OpportunityRequirementsForm = ({ opportunityId }) => {

  /** Used redux-hooks to connect the state which dispatch action 
   *  has been issued at opportunity-details.  */ 
  const { details, metadata } =  useSelector(state => state[ID], shallowEqual)

  // Aliasing/destructure a duplicate object properties
  const {
    totalInvestmentSought,
    currentInvestmentSecured,
    investmentTypes: investmentTypesValues,
    returnRate: returnRateValues,
    timeHorizons: timeHorizonsValues,
  } = details.requirementsFields

  const {
    investmentTypes: investmentTypesOptions,
    returnRates: returnRatesOptions,
    timeScales: timeScalesOptions,
  } = metadata

  return (
    <Task.Status 
      name={TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA}
      id={ID}
      startOnRender={
        {
          payload: { opportunityId },
          onSuccessDispatch: INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
        }
      }
    >
      {() => (
        <>
         <Task>
           {(getTask) => (
             <FormStateful
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
                         initialValue={formatInitialValue(totalInvestmentSought)}
                         type="text"
                         validate={(value) =>
                          !value || IS_NUMBER.test(value)
                            ? null
                            : 'Total investment sought value must be a number'
                         }
                       />

                       <FieldInput
                         label="Investment secured so far"
                         hint="Enter value in GB pounds"
                         name={CURRENT_INVESTMENT_SECURED_FIELD_NAME}
                         initialValue={formatInitialValue(currentInvestmentSecured)}
                         type="text"
                         validate={(value) =>
                          !value || IS_NUMBER.test(value)
                            ? null
                            : 'Investment secured so far value must be a number'
                         }
                       />

                       <FieldCheckboxes
                        legend="Types of investment"
                        name={INVESTMENT_TYPES_FIELD_NAME}
                        initialValue={investmentTypesValues.map(obj => obj.value)}
                        options={investmentTypesOptions}
                        required="Select an option to continue"
                       />

                       <p>If the type of investment you wish to select is not shown above, then please request it from <a href="mailto: capitalinvestment@trade.gov.uk">capitalinvestment@trade.gov.uk</a>.</p>

                       <FieldRadios
                        legend="Estimated return rate"
                        name={ESTIMATED_RETURN_RATE_FIELD_NAME}
                        initialValue={returnRateValues && returnRateValues.value}
                        options={returnRatesOptions}
                        required="Select an option to continue"
                       />

                       <FieldRadios
                        legend="Timescales"
                        name={TIME_HORIZONS_FIELD_NAME}
                        // FTB: time_horizons is array selections but it requires to refactor into object string.
                        initialValue={timeHorizonsValues.length && timeHorizonsValues[0].value}
                        options={timeScalesOptions}
                        required="Select an option to continue"
                       />

                     </Step>
                   </Main>
                 </>
               )}
             </FormStateful>
           )}
         </Task>
        </>
      )}
    </Task.Status>
  )
}

OpportunityRequirementsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default OpportunityRequirementsForm
