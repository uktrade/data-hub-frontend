import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from 'axios'
import { throttle } from 'lodash'

import {
  TASK_SAVE_OPPORTUNITY_DETAILS,
  TASK_GET_OPPORTUNITY_DETAILS_METADATA,
  ID,
  state2props,
} from './state'

import {
  INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__UPDATED,
} from '../../../../../client/actions'

import { transformDateStringToDateObject } from '../../../../transformers'

import Task from '../../../../../client/components/Task'
import TaskForm from '../../../../../client/components/Task/Form'
import {
  Main,
  FieldInput,
  FieldTextarea,
  FieldRadios,
  FieldDate,
  FieldTypeahead,
  AdviserTypeAhead,
} from '../../../../../client/components'
import FieldUKRegionTypeahead from '../../../../../client/components/Form/elements/FieldUKRegionTypeahead'
import RequiredChecksConductedRadios from '../../../../../client/components/Form/elements/FieldRequiredChecksConductedRadios'
import FieldConstructionRiskRadios from '../../../../../client/components/Form/elements/FieldConstructionRiskRadios'

import { CLEARED_REFERENCE, ISSUES_IDENTIFIED_REFERENCE } from './constants'
import { idNameToValueLabel } from './tasks'

function OpportunityDetailsForm(state) {
  const { opportunityId, metadata, opportunity, dispatch } = state
  const {
    name,
    description,
    assetClasses,
    valueType,
    leadRelationshipManager,
    requiredChecksConducted,
    requiredChecksConductedBy,
    requiredChecksConductedOn,
    constructionRisks,
    opportunityValue,
    promoters,
    otherDitContacts,
  } = opportunity.detailsFields

  const IS_NUMBER = /^[0-9]*$/

  function hintAdder(valueTypes) {
    const gdvOption = valueTypes.find(
      (type) => type.label == 'Gross development value (GDV)'
    )
    gdvOption.hint = 'For real estate projects'

    const capExOption = valueTypes.find(
      (type) => type.label == 'Capital expenditure'
    )
    capExOption.hint = 'For energy and infrastructure projects'

    return [gdvOption, capExOption]
  }
  return (
    <Main>
      <Task.Status
        name={TASK_GET_OPPORTUNITY_DETAILS_METADATA}
        id={ID}
        startOnRender={{
          onSuccessDispatch: INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
        }}
      >
        {() =>
          !!metadata.valueTypes.length && (
            <TaskForm
              id="opportunity-details"
              submissionTaskName={TASK_SAVE_OPPORTUNITY_DETAILS}
              analyticsFormName="Opportunity details"
              transformPayload={(values) => ({ opportunityId, values })}
              onSuccess={(opportunity) =>
                dispatch({
                  type: INVESTMENT_OPPORTUNITY__UPDATED,
                  opportunity,
                })
              }
            >
              {(values) => (
                <>
                  <FieldInput
                    label="Opportunity name"
                    initialValue={name}
                    name="name"
                    type="text"
                    required="Enter a name"
                  />
                  <FieldTextarea
                    label="Opportunity description"
                    initialValue={description}
                    name="description"
                    type="text"
                  />
                  <FieldUKRegionTypeahead isMulti={true} name="ukRegions" />
                  <FieldTypeahead
                    isMulti={true}
                    label="Promoters"
                    name="promoters"
                    placeholder="-- Select company --"
                    aria-label="Select a company"
                    initialValue={promoters}
                    loadOptions={throttle(
                      (searchString) =>
                        axios
                          .post('/api-proxy/v4/search/company', {
                            params: {
                              autocomplete: searchString,
                              archived: false,
                            },
                          })
                          .then(({ data: { results } }) =>
                            results.map(idNameToValueLabel)
                          ),
                      500
                    )}
                  />
                  <RequiredChecksConductedRadios
                    name="requiredChecksConducted"
                    legend="Has this opportunity cleared the required checks?"
                    initialValue={requiredChecksConducted.value}
                  />
                  {[CLEARED_REFERENCE, ISSUES_IDENTIFIED_REFERENCE].includes(
                    values.values.requiredChecksConducted
                  ) && (
                    <>
                      <FieldDate
                        name="requiredChecksConductedOn"
                        label="Date of most recent checks"
                        required="Enter a date"
                        initialValue={transformDateStringToDateObject(
                          requiredChecksConductedOn
                        )}
                      />
                      <AdviserTypeAhead
                        name="requiredChecksConductedBy"
                        label="Person responsible for most recent checks"
                        placeholder="-- Search for an adviser --"
                        required="Enter a name"
                        initialValue={requiredChecksConductedBy}
                      />
                    </>
                  )}

                  <FieldConstructionRiskRadios
                    name="constructionRisks"
                    initialValue={constructionRisks[0]?.value}
                  />
                  <AdviserTypeAhead
                    name="leadRelationshipManager"
                    label="Lead DIT relationship manager"
                    initialValue={leadRelationshipManager}
                    placeholder="-- Select adviser --"
                    isMulti={false}
                  />
                  {values.values.leadRelationshipManager && (
                    <>
                      <AdviserTypeAhead
                        name="otherDitContacts"
                        label="Other DIT contacts"
                        initialValue={otherDitContacts}
                        placeholder="-- Select adviser --"
                        aria-label="Select an adviser"
                        isMulti={true}
                      />
                    </>
                  )}
                  <FieldRadios
                    name="valueType"
                    legend="Value"
                    initialValue={valueType.value}
                    options={hintAdder(metadata.valueTypes).map((option) => ({
                      label: option.label,
                      hint: option.hint,
                      value: option.value,
                      children: (
                        <FieldInput
                          label={option.label}
                          hint="Enter the total amount in £"
                          name="opportunityValue"
                          initialValue={opportunityValue.value}
                          type="text"
                          validate={(value) =>
                            !value || IS_NUMBER.test(value)
                              ? null
                              : 'Value must be a number'
                          }
                        />
                      ),
                    }))}
                  />
                  <FieldTypeahead
                    isMulti={true}
                    label="Asset classes"
                    name="assetClasses"
                    options={metadata.classesOfInterest}
                    placeholder="-- Select asset class --"
                    aria-label="Select asset classes"
                    initialValue={assetClasses}
                  />
                  <p>
                    If the asset class you wish to select is not shown above,
                    then request it from&nbsp;
                    <a href={`mailto:capitalinvestment@trade.gov.uk`}>
                      capitalinvestment@trade.gov.uk
                    </a>
                    .
                  </p>
                  {/* <FormActions>
                    <Button data-test="save-button">Save</Button>
                    <Link
                      href={url.investments.opportunities.details(
                        opportunityId
                      )}
                    >
                      Cancel
                    </Link>
                  </FormActions> */}
                </>
              )}
            </TaskForm>
          )
        }
      </Task.Status>
    </Main>
  )
}

OpportunityDetailsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
  opportunity: PropTypes.object.isRequired,
}

export default connect(state2props)(OpportunityDetailsForm)
