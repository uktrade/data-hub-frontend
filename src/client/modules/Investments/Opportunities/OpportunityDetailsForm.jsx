import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { throttle } from 'lodash'

import { TASK_SAVE_OPPORTUNITY_DETAILS, state2props } from './state'
import urls from '../../../../lib/urls'

import { INVESTMENT_OPPORTUNITY__UPDATED } from '../../../actions'

import { convertDateToFieldDateObject } from '../../../utils/date'

import Form from '../../../components/Form'
import {
  Main,
  FieldInput,
  FieldTextarea,
  FieldDate,
  FieldTypeahead,
  FieldAdvisersTypeahead,
  FormLayout,
} from '../../../components'
import { FieldUKRegionTypeahead } from '../../../components/Form/elements/UKRegionOptions'
import { FieldRequiredChecksRadios } from '../../../components/Form/elements/RequiredChecksOptions'
import { FieldConstructionRiskRadios } from '../../../components/Form/elements/ConstructionRiskOptions'
import { FieldAssetClassTypeahead } from '../../../components/Form/elements/AssetClassOptions'

import { CLEARED_REFERENCE, ISSUES_IDENTIFIED_REFERENCE } from './constants'
import { idNamesToValueLabels } from '../../../utils'

import { FieldOpportunityValueTypeRadios } from '../../../components/Form/elements/FieldOpportunityValueType'
import { apiProxyAxios } from '../../../components/Task/utils'
import { FORM_LAYOUT } from '../../../../common/constants'
import { number } from '../../../components/Form/validators'

function OpportunityDetailsForm({ opportunityId, opportunity, dispatch }) {
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
    ukRegions,
    promoters,
    otherDitContacts,
  } = opportunity.detailsFields

  return (
    <Main>
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
          id="opportunity-details"
          submissionTaskName={TASK_SAVE_OPPORTUNITY_DETAILS}
          analyticsFormName="opportunityDetailsForm"
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
              <FieldUKRegionTypeahead
                isMulti={true}
                initialValue={ukRegions}
                name="ukRegions"
                aria-label="Select a uk location"
              />
              <FieldTypeahead
                isMulti={true}
                label="Promoters"
                name="promoters"
                placeholder="-- Select company --"
                aria-label="Select a company"
                initialValue={promoters}
                loadOptions={throttle(
                  (searchString) =>
                    apiProxyAxios
                      .post('/v4/search/company', {
                        name: searchString,
                        archived: false,
                      })
                      .then(({ data: { results } }) =>
                        idNamesToValueLabels(results)
                      ),
                  500
                )}
              />
              <FieldRequiredChecksRadios
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
                    initialValue={convertDateToFieldDateObject(
                      requiredChecksConductedOn
                    )}
                  />
                  <FieldAdvisersTypeahead
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
              <FieldAdvisersTypeahead
                name="leadRelationshipManager"
                label="Lead DBT relationship manager"
                initialValue={leadRelationshipManager}
                placeholder="-- Select adviser --"
                isMulti={false}
              />
              {values.values.leadRelationshipManager && (
                <FieldAdvisersTypeahead
                  name="otherDitContacts"
                  label="Other DBT contacts"
                  initialValue={otherDitContacts}
                  placeholder="-- Select adviser --"
                  aria-label="Select an adviser"
                  isMulti={true}
                />
              )}
              <FieldOpportunityValueTypeRadios
                name="valueType"
                legend="Value"
                initialValue={valueType.value}
                interceptOption={(option) => ({
                  ...option,
                  hint: {
                    'Capital expenditure':
                      'For energy and infrastructure projects',
                    'Gross development value (GDV)': 'For real estate projects',
                  }[option.label],
                  children: (
                    <FieldInput
                      label={option.label}
                      hint="Enter the total amount in £"
                      name="opportunityValue"
                      initialValue={opportunityValue.value}
                      type="text"
                      validate={(value) =>
                        number(value, 'Value must be a number')
                      }
                    />
                  ),
                })}
              />
              <FieldAssetClassTypeahead
                isMulti={true}
                name="assetClasses"
                initialValue={assetClasses}
              />
              <p>
                If the asset class you wish to select is not shown above, then
                request it from&nbsp;
                <a href={`mailto:capitalinvestment@trade.gov.uk`}>
                  capitalinvestment@trade.gov.uk
                </a>
                .
              </p>
            </>
          )}
        </Form>
      </FormLayout>
    </Main>
  )
}

OpportunityDetailsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  opportunity: PropTypes.object.isRequired,
}

export default connect(state2props)(OpportunityDetailsForm)
