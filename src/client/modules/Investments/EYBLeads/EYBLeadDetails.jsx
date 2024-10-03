import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link } from 'govuk-react'
import Button from '@govuk-react/button'

import { state2props } from './state'
import { format } from '../../../utils/date'
import urls from '../../../../lib/urls'
import { EYBLeadResource } from '../../../components/Resource'
import { EYBLeadLayout, NewWindowLink, SummaryTable } from '../../../components'

const EYBLeadDetails = () => {
  const { eybLeadId } = useParams()
  return (
    <EYBLeadLayout id={eybLeadId}>
      <EYBLeadResource id={eybLeadId}>
        {(eybLead) => {
          return (
            <SummaryTable data-test="eyb-lead-details-table">
              <SummaryTable.TextRow
                heading="Company name"
                value={
                  <Link
                    href={urls.companies.overview.index(eybLead.company?.id)}
                    data-test="company-link"
                  >
                    {eybLead.company?.name}
                  </Link>
                }
              />
              <SummaryTable.Row
                heading="Value"
                children={eybLead.is_high_value ? 'Low value' : 'High value'}
              />
              <SummaryTable.Row
                heading="Sector or industry"
                children={eybLead.sector.name}
              />
              <SummaryTable.Row
                heading="Location of company headquarters"
                children={eybLead.companyLocation.name}
              />
              <SummaryTable.Row
                heading="Submitted to EYB"
                children={format(eybLead.triageCreated, 'dd MMM yyyy')}
              />
              <SummaryTable.Row heading="Company website address">
                {eybLead.companyWebsite ? (
                  <NewWindowLink href={eybLead.companyWebsite}>
                    {eybLead.companyWebsite}
                  </NewWindowLink>
                ) : (
                  'Not set'
                )}
              </SummaryTable.Row>
              <SummaryTable.Row
                heading="When do you want to set up?"
                children={eybLead.landingTimeframe}
              />
              <SummaryTable.Row
                heading="Do you know where you want to set up in the UK?"
                children={eybLead.locationNone ? 'No' : 'Yes'}
              />
              <SummaryTable.Row
                heading="Where do you want to set up in the UK?"
                children={eybLead.locationCity}
              />
              <SummaryTable.Row
                heading="How do you plan to expand your business in the UK?"
                children={eybLead.intent}
              />
              <SummaryTable.Row
                heading="How many people do you want to hire in the UK in the first 3 years?"
                children={eybLead.hiring}
              />
              <SummaryTable.Row
                heading="How much do you want to spend on setting up in the first 3 years?"
                children={eybLead.spend}
              />
              <SummaryTable.Row
                heading="Full name"
                children={eybLead.fullName}
              />
              <SummaryTable.Row heading="Job title" children={eybLead.role} />
              <SummaryTable.Row
                heading="Phone number"
                children={eybLead.telephoneNumber}
              />
            </SummaryTable>
          )
        }}
      </EYBLeadResource>
    </EYBLeadLayout>
  )
}

export default connect(state2props)(EYBLeadDetails)
