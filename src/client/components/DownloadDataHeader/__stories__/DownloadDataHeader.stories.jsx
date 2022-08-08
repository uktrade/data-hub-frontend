import React from 'react'
import { storiesOf } from '@storybook/react'

import DownloadDataHeader from '..'

const downloadDataHeaderStories = storiesOf('DownloadDataHeader', module)

const BasicDownloadDataHeader = () => (
  <DownloadDataHeader
    count={5}
    entityName="entity"
    entityNamePlural="entities"
    downloadLink="/#dl"
  />
)

const SingularDownloadDataHeader = () => {
  return <DownloadDataHeader count={1} downloadLink="/#dl" />
}

const LimitedDownloadDataHeader = () => {
  return <DownloadDataHeader count={5000} maxItems={1000} downloadLink="/#dl" />
}

downloadDataHeaderStories
  .addParameters({ component: DownloadDataHeader })
  .add('Basic', () => <BasicDownloadDataHeader />)
  .add('One Item', () => <SingularDownloadDataHeader />)
  .add('Limited ', () => <LimitedDownloadDataHeader />)
