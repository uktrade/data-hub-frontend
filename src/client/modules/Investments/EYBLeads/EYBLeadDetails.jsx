import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { state2props } from './state'
import { format } from '../../../utils/date'

import { EYBLeadResource } from '../../../components/Resource'
import { DefaultLayout, SummaryTable } from '../../../components'

const EYBLeadDetails = () => {
  const { eybLeadId } = useParams()
  return (
    <DefaultLayout
      heading={'EYB lead'}
      pageTitle={'EYB Lead'}
      breadcrumbs={[]}
      useReactRouter={false}
    >
      <EYBLeadResource id={eybLeadId}>
        {(eybLead) => {
          return (
            <SummaryTable data-test="eyb-lead-details-table">
              <SummaryTable.Row
                heading="Company name"
                children={eybLead.company.name}
              />
              <SummaryTable.Row
                heading="Value"
                children={eybLead.is_high_value ? 'High value' : 'Low value'}
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
                heading="Transferred from EYB"
                children={format(eybLead.createdOn, 'dd MMM yyyy')}
              />
              <SummaryTable.Row
                heading="Company website address"
                children={eybLead.companyWebsite + ' (opens in new tab)'}
              />
              <SummaryTable.Row
                heading="Do you know where you want to set up in the UK?"
                children={eybLead.location ? 'Yes' : 'No'}
              />
              <SummaryTable.Row
                heading="Where do you want to set up in the UK?"
                children={eybLead.locationCity}
              />
              <SummaryTable.Row
                heading="How do you plan to expand your business in the UK in the first 3 years?"
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
    </DefaultLayout>
  )
}

export default connect(state2props)(EYBLeadDetails)
