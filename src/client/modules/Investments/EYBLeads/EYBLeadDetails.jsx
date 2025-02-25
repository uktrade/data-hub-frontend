import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { SPACING_POINTS } from '@govuk-react/constants'

import { formatDate, DATE_FORMAT_COMPACT } from '../../../utils/date-utils'
import urls from '../../../../lib/urls'
import {
  convertEYBChoicesToLabels,
  formatProposedInvestmentCity,
} from '../utils'
import { EYBLeadResource } from '../../../components/Resource'
import { EYBLeadLayout, NewWindowLink, SummaryTable } from '../../../components'
import { NOT_SET_TEXT } from '../../../../apps/companies/constants'
import { VALUES_VALUE_TO_LABEL_MAP } from './constants'

const StyledRoot = styled('div')`
  {
    margin-top: ${SPACING_POINTS[4]}px;
    margin-bottom: ${SPACING_POINTS[4]}px;
  }
`
const EYBLeadDetails = () => {
  const { eybLeadId } = useParams()
  return (
    <EYBLeadLayout id={eybLeadId}>
      <EYBLeadResource id={eybLeadId}>
        {(eybLead) => {
          return (
            <>
              <StyledRoot>
                <div>
                  Changes made to this information can be found on the{' '}
                  <Link
                    href={urls.investments.eybLeads.editHistory.index(
                      eybLeadId
                    )}
                  >
                    Edit history page
                  </Link>
                  .
                </div>
              </StyledRoot>
              <SummaryTable data-test="eyb-lead-details-table">
                {eybLead.company ? (
                  <SummaryTable.TextRow
                    heading="Company name"
                    value={
                      <Link
                        href={urls.companies.overview.index(
                          eybLead.company?.id
                        )}
                        data-test="company-link"
                      >
                        {eybLead.company.name}
                      </Link>
                    }
                  />
                ) : (
                  <SummaryTable.TextRow
                    heading="Company name"
                    value={eybLead.companyName}
                  />
                )}
                <SummaryTable.Row
                  heading="Value"
                  children={VALUES_VALUE_TO_LABEL_MAP[eybLead.isHighValue]}
                />
                <SummaryTable.Row
                  heading="Sector or industry"
                  children={eybLead.sector ? eybLead.sector.name : NOT_SET_TEXT}
                />
                <SummaryTable.Row
                  heading="Location of company headquarters"
                  children={eybLead.address?.country?.name}
                />
                <SummaryTable.Row
                  heading="Submitted to EYB"
                  children={formatDate(
                    eybLead.triageCreated,
                    DATE_FORMAT_COMPACT
                  )}
                />
                <SummaryTable.Row heading="Company website address">
                  {eybLead.companyWebsite ? (
                    <NewWindowLink
                      data-test="website-link"
                      href={'//' + eybLead.companyWebsite}
                    >
                      {eybLead.companyWebsite}
                    </NewWindowLink>
                  ) : (
                    NOT_SET_TEXT
                  )}
                </SummaryTable.Row>
                <SummaryTable.Row
                  heading="When do you want to set up?"
                  children={convertEYBChoicesToLabels(eybLead.landingTimeframe)}
                />
                <SummaryTable.Row
                  heading="Do you know where you want to set up in the UK?"
                  children={
                    eybLead.proposedInvestmentLocationNone ? 'No' : 'Yes'
                  }
                />
                <SummaryTable.Row
                  heading="Where do you want to set up in the UK?"
                  children={formatProposedInvestmentCity(
                    eybLead.proposedInvestmentCity
                  )}
                />
                <SummaryTable.Row
                  heading="How do you plan to expand your business in the UK?"
                  children={convertEYBChoicesToLabels(eybLead.intent)}
                />
                <SummaryTable.Row
                  heading="How many people do you want to hire in the UK in the first 3 years?"
                  children={convertEYBChoicesToLabels(eybLead.hiring)}
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
                <SummaryTable.Row
                  heading="Email"
                  children={eybLead.email ? eybLead.email : NOT_SET_TEXT}
                />
              </SummaryTable>
            </>
          )
        }}
      </EYBLeadResource>
    </EYBLeadLayout>
  )
}

export default EYBLeadDetails
