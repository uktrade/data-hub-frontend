import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import { ID, state2props, TASK_SAVE_OPPORTUNITY_STATUS, SAVED } from './state'
import { INVESTMENT_OPPORTUNITY__STATUS_CHANGE } from '../../../../../client/actions'

import Task from '../../../../../client/components/Task'
// import HardRedirect from '../../../../../client/components/HardRedirect'
import {
  Main,
  FormActions,
  MultiInstanceForm,
  FieldRadios,
} from '../../../../../client/components'

import OpportunityResource from '../../../../../client/components/Resource/Opportunity'
import OpportunityStatusResource from '../../../../../client/components/Resource/OpportunityStatuses'

const OpportunityChangeStatus = (state) => {
  const { opportunityId } = state

  const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

  const buildBreadcrumbs = (opportunityName) => {
    return [
      { link: urls.dashboard(), text: 'Home' },
      { link: urls.investments.index(), text: 'Investments' },
      {
        link: urls.investments.opportunities.index(),
        text: 'UK opportunities',
      },
      {
        link: urls.investments.opportunities.details(opportunityId),
        text: opportunityName,
      },
      { text: 'Change status' },
    ]
  }

  useEffect(() => {
    if (state[SAVED]) {
      window.location.href =
        urls.investments.opportunities.details(opportunityId)
    }
  })

  return (
    <OpportunityResource id={opportunityId}>
      {(details) =>
        details.name.length && (
          <>
            <LocalHeader
              breadcrumbs={buildBreadcrumbs(details.name)}
              heading={'Change opportunity status'}
            />
            <Task>
              {(getTask) => {
                const saveStatusTask = getTask(TASK_SAVE_OPPORTUNITY_STATUS, ID)
                return (
                  <OpportunityStatusResource>
                    {(opportunityStatuses) => (
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
                              name="status"
                              options={opportunityStatuses.map(
                                idNameToValueLabel
                              )}
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
                  </OpportunityStatusResource>
                )
              }}
            </Task>
          </>
        )
      }
    </OpportunityResource>
  )
}

OpportunityChangeStatus.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default connect(state2props)(OpportunityChangeStatus)
