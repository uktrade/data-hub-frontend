import React from 'react'

import DownloadDataHeader from '..'

export default {
  title: 'DownloadDataHeader',

  parameters: {
    component: DownloadDataHeader,
  },
}

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

export const Basic = () => <BasicDownloadDataHeader />
export const OneItem = () => <SingularDownloadDataHeader />
export const Limited = () => <LimitedDownloadDataHeader />

Limited.story = {
  name: 'Limited ',
}
