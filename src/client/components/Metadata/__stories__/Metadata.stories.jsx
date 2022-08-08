import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '@govuk-react/link'

import Metadata from 'Metadata'

const metadata = [
  { label: 'Updated on', value: '5 September 2019' },
  { label: 'Sector', value: 'Environment' },
  {
    label: 'Parent company',
    value: <Link href="http://example.com">E-corp LTD</Link>,
  },
]

storiesOf('Metadata', module)
  .addParameters({ component: Metadata })
  .add('Default', () => <Metadata rows={metadata} />)
