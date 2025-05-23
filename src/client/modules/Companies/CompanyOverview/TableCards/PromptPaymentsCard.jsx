import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FONT_SIZE } from '@govuk-react/constants'

import { NewWindowLink, SummaryTableHighlight } from '../../../../components'
import urls from '../../../../../lib/urls'
// import { PromptPaymentsResource } from '../../../../components/Resource'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const StyledNewWindowLink = styled(NewWindowLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

const PromptPaymentsCard = ({ companyId }) => {
  return (
    // <PromptPaymentsResource id={companyId}>
    //   {(abc) =>
    //     promptPayments && promptPayments.length ? (
    <CardContainer>
      <SummaryTableHighlight
        caption="Payment practice"
        data-test="prompt-payments"
      >
        <SummaryTableHighlight.HighlightRow heading="Average time taken to pay invoices">
          57 days
        </SummaryTableHighlight.HighlightRow>
        <SummaryTableHighlight.HighlightRow heading="Payments due which have not been paid within agreed period">
          2%
        </SummaryTableHighlight.HighlightRow>
        <SummaryTableHighlight.Row heading="Reporting period">
          26th August 2024 to 23 February 2025
        </SummaryTableHighlight.Row>
        <SummaryTableHighlight.Row heading="Report filled on">
          21 March 2025
        </SummaryTableHighlight.Row>
        <SummaryTableHighlight.Row heading="Approved by">
          Charles Darwin
        </SummaryTableHighlight.Row>
      </SummaryTableHighlight>
      <StyledNewWindowLink
        href={urls.companies.businessDetails(companyId)}
        data-test="promp-payments-link"
      >
        See the full report on the Prompt Payments Service
      </StyledNewWindowLink>
    </CardContainer>
    // ) : null
    // }
    // </PromptPaymentsResource>
  )
}

PromptPaymentsCard.propTypes = {
  companyId: PropTypes.object.isRequired,
}

export default PromptPaymentsCard
