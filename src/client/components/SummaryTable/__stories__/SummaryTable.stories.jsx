import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '@govuk-react/link'

import SummaryTable from 'SummaryTable'

storiesOf('SummaryTable', module).add('Default', () => (
  <SummaryTable
    caption="About company"
    actions={<Link href="https://example.com">Edit</Link>}
  >
    <SummaryTable.Row heading="Name">Example company name</SummaryTable.Row>
    <SummaryTable.Row heading="Companies House number">
      123
      <Link href="https://beta.companieshouse.gov.uk/company/123">
        View on Companies House website
      </Link>
    </SummaryTable.Row>
    <SummaryTable.Row heading="Business type">Company</SummaryTable.Row>
  </SummaryTable>
))
