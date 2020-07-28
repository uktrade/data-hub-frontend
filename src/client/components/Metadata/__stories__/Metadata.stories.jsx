import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '@govuk-react/link'

import Metadata from 'Metadata'

const stories = storiesOf('Metadata', module)

const metadata = [
  { label: 'Updated on', value: '5 September 2019' },
  { label: 'Sector', value: 'Environment' },
  {
    label: 'Parent company',
    value: <Link href="http://example.com">E-corp LTD</Link>,
  },
]

stories.add('Default', () => <Metadata rows={metadata} />)
