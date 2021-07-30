import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import {
  ID,
  state2props,
  TASK_GET_OPPORTUNITY_DETAILS,
  TASK_SAVE_OPPORTUNITY_STATUS,
  TASK_GET_OPPORTUNITY_STATUS_METADATA,
  SAVED,
} from './state'
import {
  INVESTMENT_OPPORTUNITY__STATUS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__STATUS_CHANGE,
  INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
} from '../../../../../client/actions'

import Task from '../../../../../client/components/Task'
import {
  Main,
  FormActions,
  MultiInstanceForm,
  FieldRadios,
} from '../../../../../client/components'
import { STATUS_FIELD_NAME } from '../Details/constants'

const OpportunityChangeStatus = (state) => {
  const { opportunityId, details, metadata } = state
  const { opportunityStatuses: opportunityStatusOptions } = metadata

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    {
      link: urls.investments.opportunities.index(),
      text: 'UK opportunities',
    },
    {
      link: urls.investments.opportunities.details(opportunityId),
      text: details.detailsFields.name,
    },
    { text: 'Change status' },
  ]

  useEffect(() => {
    if (state[SAVED]) {
      window.location.href =
        urls.investments.opportunities.details(opportunityId)
    }
  })

  return (
    <Task.Status
      name={TASK_GET_OPPORTUNITY_DETAILS}
      id={ID}
      progressMessage="Loading opportunity"
      startOnRender={{
        payload: {
          opportunityId,
        },
        onSuccessDispatch: INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
      }}
    >
      {() =>
        details.detailsFields.name.length && (
          <>
            <LocalHeader
              breadcrumbs={breadcrumbs}
              heading={'Change opportunity status'}
            />
            <Task>
              {(getTask) => {
                const saveStatusTask = getTask(TASK_SAVE_OPPORTUNITY_STATUS, ID)
                return (
                  <Task.Status
                    name={TASK_GET_OPPORTUNITY_STATUS_METADATA}
                    id={ID}
                    startOnRender={{
                      onSuccessDispatch:
                        INVESTMENT_OPPORTUNITY__STATUS_METADATA_LOADED,
                    }}
                  >
                    {() => (
                      <>
                        <Main>
                          <MultiInstanceForm
                            id={ID}
                            showErrorSummary={true}
                            onSubmit={(values) => {
                              saveStatusTask.start({
                                payload: { values, opportunityId },
                                onSuccessDispatch:
                                  INVESTMENT_OPPORTUNITY__STATUS_CHANGE,
                              })
                            }}
                          >
                            <FieldRadios
                              name={STATUS_FIELD_NAME}
                              options={opportunityStatusOptions}
                              data-test="types-of-status"
                              required="You must select a status"
                            />
                            <FormActions>
                              <Button data-test="edit-button">Save</Button>
                              <Link
                                href={urls.investments.opportunities.details(
                                  opportunityId
                                )}
                              >
                                Cancel
                              </Link>
                            </FormActions>
                          </MultiInstanceForm>
                        </Main>
                      </>
                    )}
                  </Task.Status>
                )
              }}
            </Task>
          </>
        )
      }
    </Task.Status>
  )
}

OpportunityChangeStatus.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default connect(state2props)(OpportunityChangeStatus)
