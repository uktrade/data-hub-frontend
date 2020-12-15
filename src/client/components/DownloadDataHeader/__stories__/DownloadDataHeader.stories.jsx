import React from 'react'
import { storiesOf } from '@storybook/react'

import DownloadDataHeader from '..'

const downloadDataHeaderStories = storiesOf('DownloadDataHeader', module)

const BasicDownloadDataHeader = () => {
  return <DownloadDataHeader count={5} downloadLink="/#dl" />
}

const SingularDownloadDataHeader = () => {
  return <DownloadDataHeader count={1} downloadLink="/#dl" />
}

const LimitedDownloadDataHeader = () => {
  return <DownloadDataHeader count={5000} maxItems={1000} downloadLink="/#dl" />
}

downloadDataHeaderStories
  .add('Basic', () => <BasicDownloadDataHeader />)
  .add('One Item', () => <SingularDownloadDataHeader />)
  .add('Limited ', () => <LimitedDownloadDataHeader />)
