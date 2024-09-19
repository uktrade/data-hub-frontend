import React from 'react'
import { action } from '@storybook/addon-actions'

import EntityList from '..'

import useDnbSearch from '../useDnbSearch'
import companySearchFixture from '../__fixtures__/company-search.json'

export default {
  title: 'EntitySearch',

  parameters: {
    component: EntityList,
  },
}

export const EntityListDnB = () => {
  const { transformCompanyRecord } = useDnbSearch()
  const fixtures = companySearchFixture.results.map(transformCompanyRecord)
  return (
    <EntityList
      onEntityClick={action('EntitySearch.onEntityClick')}
      entities={fixtures}
    />
  )
}

EntityListDnB.story = {
  name: 'EntityList - DnB',
}
