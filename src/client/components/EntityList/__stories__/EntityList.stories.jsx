import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import useDnbSearch from '../useDnbSearch'
import companySearchFixture from '../__fixtures__/company-search.json'
import EntityList from 'EntityList'

storiesOf('EntitySearch', module).add('EntityList - DnB', () => {
  const { transformCompanyRecord } = useDnbSearch()
  const fixtures = companySearchFixture.results.map(transformCompanyRecord)
  return (
    <EntityList
      onEntityClick={action('EntitySearch.onEntityClick')}
      entities={fixtures}
    />
  )
})
