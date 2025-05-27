import React from 'react'
import Link from '@govuk-react/link'

import SummaryTableHighlight from '..'

export default {
  title: 'SummaryTableHighlight',

  parameters: {
    component: SummaryTableHighlight,
  },
}

export const Default = () => (
  <SummaryTableHighlight caption="About company">
    <SummaryTableHighlight.HighlightRow
      isHalf={false}
      heading="Full width highlight"
    >
      £100M
    </SummaryTableHighlight.HighlightRow>
    <SummaryTableHighlight.HighlightRow heading="Some half highlighted stat">
      £100M
    </SummaryTableHighlight.HighlightRow>
    <SummaryTableHighlight.HighlightRow heading="Some other half stat to highlight">
      9,990
    </SummaryTableHighlight.HighlightRow>
    <SummaryTableHighlight.Row heading="Companies House number">
      123
      <Link href="https://beta.companieshouse.gov.uk/company/123">
        View on Companies House website
      </Link>
    </SummaryTableHighlight.Row>
    <SummaryTableHighlight.Row heading="Business type">
      Company
    </SummaryTableHighlight.Row>
  </SummaryTableHighlight>
)
