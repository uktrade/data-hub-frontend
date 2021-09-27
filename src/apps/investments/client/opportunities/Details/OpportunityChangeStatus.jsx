import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import {
  Main,
  FormActions,
  FormStateful,
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

  return (
    <OpportunityResource id={opportunityId}>
      {(opportunity) =>
        // TODO: Isn't this always true?
        opportunity.name.length && (
          <>
            <LocalHeader
              breadcrumbs={buildBreadcrumbs(opportunity.name)}
              heading={'Change opportunity status'}
            />
            <OpportunityStatusResource>
              {(opportunityStatuses) => (
                <Main>
                  <FormStateful
                    showErrorSummary={true}
                    onSubmit={async (values) => {
                      await axios.patch(
                        `/api-proxy/v4/large-capital-opportunity/${opportunityId}`,
                        {
                          status: values.status,
                        }
                      )
                      return urls.investments.opportunities.details(
                        opportunityId
                      )
                    }}
                  >
                    {/* TODO: Abstract away into an OpportunityStatusesRadios component */}
                    <FieldRadios
                      name="status"
                      options={opportunityStatuses.map(idNameToValueLabel)}
                      initialValue={opportunity.status.id}
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
                  </FormStateful>
                </Main>
              )}
            </OpportunityStatusResource>
          </>
        )
      }
    </OpportunityResource>
  )
}

OpportunityChangeStatus.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default OpportunityChangeStatus
