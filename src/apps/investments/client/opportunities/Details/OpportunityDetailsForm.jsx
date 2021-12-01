import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from 'axios'
import { throttle } from 'lodash'

import { TASK_SAVE_OPPORTUNITY_DETAILS, state2props } from './state'
import urls from '../../../../../lib/urls'

import { INVESTMENT_OPPORTUNITY__UPDATED } from '../../../../../client/actions'

import { transformDateStringToDateObject } from '../../../../transformers'

import TaskForm from '../../../../../client/components/Task/Form'
import {
  Main,
  FieldInput,
  FieldTextarea,
  FieldDate,
  FieldTypeahead,
  AdviserTypeAhead,
} from '../../../../../client/components'
import { FieldUKRegionTypeahead } from '../../../../../client/components/Form/elements/UKRegionOptions'
import { FieldRequiredChecksRadios } from '../../../../../client/components/Form/elements/RequiredChecksOptions'
import { FieldConstructionRiskRadios } from '../../../../../client/components/Form/elements/ConstructionRiskOptions'
import { FieldAssetClassTypeahead } from '../../../../../client/components/Form/elements/AssetClassOptions'

import { CLEARED_REFERENCE, ISSUES_IDENTIFIED_REFERENCE } from './constants'
import { idNamesToValueLabels } from '../../../../../client/utils'

import { FieldOpportunityValueTypeRadios } from '../../../../../client/components/Form/elements/FieldOpportunityValueType'

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

  const IS_NUMBER = /^[0-9]*$/

  return (
    <Main>
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
        actionLinks={[
          {
            children: 'Cancel',
            href: urls.investments.opportunities.details(opportunityId),
          },
        ]}
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
            {/* TODO: Use FieldTaskTypeahead */}
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
                      !value || IS_NUMBER.test(value)
                        ? null
                        : 'Value must be a number'
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
      </TaskForm>
    </Main>
  )
}

OpportunityDetailsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  opportunity: PropTypes.object.isRequired,
}

export default connect(state2props)(OpportunityDetailsForm)
