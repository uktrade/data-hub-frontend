import React from 'react'
import Link from '@govuk-react/link'

import Metadata from '..'

const metadata = [
  { label: 'Updated on', value: '5 September 2019' },
  { label: 'Sector', value: 'Environment' },
  {
    label: 'Parent company',
    value: <Link href="http://example.com">E-corp LTD</Link>,
  },
]

export default {
  title: 'Metadata',

  parameters: {
    component: Metadata,
  },
}

export const Default = () => <Metadata rows={metadata} />
