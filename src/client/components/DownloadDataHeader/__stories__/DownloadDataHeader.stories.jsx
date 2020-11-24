import React from 'react'
import { storiesOf } from '@storybook/react'

import DownloadDataHeader from 'DownloadDataHeader'

const downloadDataHeaderStories = storiesOf('DownloadDataHeader', module)

const BasicDownloadDataHeader = () => {
  return <DownloadDataHeader count={5} />
}

const SingularDownloadDataHeader = () => {
  return <DownloadDataHeader count={1} />
}

const LimitedDownloadDataHeader = () => {
  return <DownloadDataHeader count={5000} maxItems={1000} />
}

downloadDataHeaderStories
  .add('Basic', () => <BasicDownloadDataHeader />)
  .add('One Item', () => <SingularDownloadDataHeader />)
  .add('Limited ', () => <LimitedDownloadDataHeader />)
