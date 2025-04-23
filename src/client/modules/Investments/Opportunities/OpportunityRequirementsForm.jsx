import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../../lib/urls'

import {
  ID,
  state2props,
  TASK_SAVE_OPPORTUNITY_REQUIREMENTS,
  TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA,
} from './state'
import {
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__UPDATED,
} from '../../../actions'

import Task from '../../../components/Task'
import Form from '../../../components/Form'
import {
  Main,
  FieldInput,
  FieldCheckboxes,
  FieldRadios,
  FormLayout,
} from '../../../components'
import {
  TOTAL_INVESTMENT_SOUGHT_FIELD_NAME,
  CURRENT_INVESTMENT_SECURED_FIELD_NAME,
  INVESTMENT_TYPES_FIELD_NAME,
  ESTIMATED_RETURN_RATE_FIELD_NAME,
  TIME_HORIZONS_FIELD_NAME,
} from './constants'
import { FORM_LAYOUT } from '../../../../common/constants'
import { number } from '../../../components/Form/validators'
import AccessibleLink from '../../../components/Link'

const StyledFieldCheckboxes = styled(FieldCheckboxes)`
  margin-bottom: 0;
`

const StyledP = styled('p')`
  margin-bottom: ${SPACING.SCALE_5};
`

const OpportunityRequirementsForm = (state) => {
  const { opportunityId, opportunity, metadata, dispatch } = state
  const {
    totalInvestmentSought,
    currentInvestmentSecured,
    investmentTypes: investmentTypesValues,
    returnRate: returnRateValues,
    timeHorizons: timeHorizonsValues,
  } = opportunity.requirementsFields

  const {
    investmentTypes: investmentTypesOptions,
    returnRates: returnRatesOptions,
    timeScales: timeScalesOptions,
  } = metadata

  return (
    <Task.Status
      name={TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA}
      id={ID}
      startOnRender={{
        onSuccessDispatch: INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
      }}
    >
      {() =>
        !!metadata.investmentTypes.length && (
          <>
            <Main>
              <Form
                id="opportunity-requirements"
                submissionTaskName={TASK_SAVE_OPPORTUNITY_REQUIREMENTS}
                analyticsFormName="opportunityRequirementsForm"
                transformPayload={(values) => ({ opportunityId, values })}
                onSuccess={(opportunity) =>
                  dispatch({
                    type: INVESTMENT_OPPORTUNITY__UPDATED,
                    opportunity,
                  })
                }
                cancelRedirectTo={() =>
                  urls.investments.opportunities.details(opportunityId)
                }
              >
                <FormLayout setWidth={FORM_LAYOUT.ONE_THIRD}>
                  <FieldInput
                    label="Total investment sought"
                    hint="Enter value in £"
                    name={TOTAL_INVESTMENT_SOUGHT_FIELD_NAME}
                    initialValue={totalInvestmentSought}
                    type="text"
                    validate={(value) =>
                      number(
                        value,
                        'Total investment sought value must be a number'
                      )
                    }
                  />
                  <FieldInput
                    label="Investment secured so far"
                    hint="Enter value in £"
                    name={CURRENT_INVESTMENT_SECURED_FIELD_NAME}
                    initialValue={currentInvestmentSecured}
                    type="text"
                    validate={(value) =>
                      number(
                        value,
                        'Investment secured so far value must be a number'
                      )
                    }
                  />
                </FormLayout>
                <StyledFieldCheckboxes
                  legend="Types of investment"
                  name={INVESTMENT_TYPES_FIELD_NAME}
                  initialValue={investmentTypesValues.map((obj) => obj.value)}
                  options={investmentTypesOptions}
                  data-test="types-of-investment"
                />
                <StyledP>
                  If you can’t see the type of investment you need, request it
                  from{' '}
                  <AccessibleLink href="mailto:capitalinvestment@trade.gov.uk">
                    capitalinvestment@trade.gov.uk
                  </AccessibleLink>
                  .
                </StyledP>
                <FieldRadios
                  legend="Estimated return rate"
                  name={ESTIMATED_RETURN_RATE_FIELD_NAME}
                  initialValue={returnRateValues && returnRateValues.value}
                  options={returnRatesOptions}
                  data-test="estimated-return-rate"
                />
                <FieldRadios
                  legend="Timescales"
                  name={TIME_HORIZONS_FIELD_NAME}
                  initialValue={timeHorizonsValues[0]?.value}
                  options={timeScalesOptions}
                  data-test="timescales"
                />
              </Form>
            </Main>
          </>
        )
      }
    </Task.Status>
  )
}

OpportunityRequirementsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}
export default connect(state2props)(OpportunityRequirementsForm)
