import React from 'react'
import { storiesOf } from '@storybook/react'

import exampleReadme from './example.md'
import usageReadme from './usage.md'
import { Dynamicfields } from '../DynamicFields'
import SummaryTable from '../../SummaryTable'
import Link from '@govuk-react/link'

const items = {
  vat_number: { label: 'VAT Number', value: 'A VAT Number' },
  business_type: { label: 'Business type', value: 'A Business type' },
  company_number: {
    label: 'Companies House Number',
    value: 'A Companies House Number',
  },
  website: { label: 'Website', value: 'A website' },
}

storiesOf('Local Header Details', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <SummaryTable
      caption={`About Sample Company`}
      data-test="aboutCompanyContainer"
      actions={<Link href="sample-link">Edit</Link>}
    >
      <Dynamicfields items={items} />
    </SummaryTable>
  ))
