import React from 'react'
import { storiesOf } from '@storybook/react'
import useMyCompaniesContext from '../my-companies/useMyCompaniesContext'
import MyCompaniesTile from '../my-companies/MyCompaniesTile'
import allCompanies from '../__fixtures__/companies.json'

const WithData = (props) => (
  <useMyCompaniesContext.Provider {...props}>
    <MyCompaniesTile />
  </useMyCompaniesContext.Provider>
)

storiesOf('Dashboard')
  .add('No lists', () => <WithData />)
  .add('One empty list', () => (
    <WithData
      deleteListPropsAccessor={({ id }) => ({ href: id })}
      lists={[{ id: 'foo', name: "I'm empty", companies: [] }]}
    />
  ))
  .add('One full list', () => (
    <WithData
      deleteListPropsAccessor={({ id }) => ({ href: id })}
      addInteractionPropsAccessor={(company) => ({
        href: `/companies/${company.id}/interactions/create`,
      })}
      lists={[{ id: 'foo', name: 'Foo', companies: allCompanies }]}
    />
  ))
  .add('Three lists, first empty', () => (
    <WithData
      deleteListPropsAccessor={({ id }) => ({ href: id })}
      lists={[
        { id: 'foo', name: 'Foo', companies: allCompanies },
        { id: 'bar', name: 'Bar', companies: [] },
        { id: 'baz', name: 'Baz', companies: allCompanies.slice(0, -1) },
      ]}
    />
  ))
  .add('Three lists, first with single company', () => (
    <WithData
      deleteListPropsAccessor={({ id }) => ({ href: id })}
      addInteractionPropsAccessor={(company) => ({
        href: `/companies/${company.id}/interactions/create`,
      })}
      lists={[
        { id: 'foo', name: 'Foo', companies: allCompanies },
        { id: 'bar', name: 'Bar', companies: allCompanies.slice(1, 2) },
        { id: 'baz', name: 'Baz', companies: allCompanies.slice(0, -1) },
      ]}
    />
  ))
  .add('Three company lists', () => (
    <WithData
      deleteListPropsAccessor={({ id }) => ({ href: id })}
      addInteractionPropsAccessor={(company) => ({
        href: `/companies/${company.id}/interactions/create`,
      })}
      lists={[
        {
          id: 'foo',
          name: 'Very long list name lorem ipsum dolor sit amet',
          companies: allCompanies,
        },
        { id: 'bar', name: 'Bar', companies: allCompanies.slice(1) },
        { id: 'baz', name: 'Baz', companies: allCompanies.slice(0, -1) },
      ]}
    />
  ))
