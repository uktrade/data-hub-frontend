import React from 'react'
import { storiesOf } from '@storybook/react'

import LocalHeaderDetails from '../index'
import LocalHeader from '../../LocalHeader/LocalHeader'

const items = [
  { label: 'Name', value: 'A name' },
  { label: 'Location', value: 'A location' },
  { label: 'Company', value: 'A company' },
  { label: 'Job', value: 'A job' },
]

storiesOf('LocalHeader/LocalHeaderDetails', module)
  .addParameters({ component: LocalHeaderDetails })
  .add('Default', () => (
    <LocalHeader
      breadcrumbs={[{ link: '/', text: 'Home' }, { text: 'Example' }]}
      heading="Example"
    >
      <LocalHeaderDetails items={items} />
    </LocalHeader>
  ))
