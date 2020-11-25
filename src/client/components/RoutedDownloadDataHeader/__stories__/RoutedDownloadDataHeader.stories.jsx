import React from 'react'
import { storiesOf } from '@storybook/react'

import RoutedDownloadDataHeader from 'RoutedDownloadDataHeader'

const routedDownloadDataHeaderStories = storiesOf('DownloadDataHeader', module)

const BasicRoutedDownloadDataHeader = () => {
  return <RoutedDownloadDataHeader count={5} />
}

const SingularRoutedDownloadDataHeader = () => {
  return <RoutedDownloadDataHeader count={1} />
}

const LimitedRoutedDownloadDataHeader = () => {
  return <RoutedDownloadDataHeader count={5000} maxItems={1000} />
}

routedDownloadDataHeaderStories
  .add('Basic', () => <BasicRoutedDownloadDataHeader />)
  .add('One Item', () => <SingularRoutedDownloadDataHeader />)
  .add('Limited ', () => <LimitedRoutedDownloadDataHeader />)
