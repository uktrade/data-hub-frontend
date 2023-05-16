import React from 'react'

import TabNav from '../../TabNav'
import Contact from '../Contact'
import Company from '../Company'
import Resource from '../Resource'

const Json = ({ children }) => <pre>{JSON.stringify(children, null, 2)}</pre>

export default {
  title: 'Resource',
}

export const Default = () => (
  <TabNav
    id="resource-example"
    label="Resource examples"
    selectedIndex={'Resource example'}
    tabs={[
      {
        label: 'Example resolved',
        content: (
          <Resource
            name="Resource example"
            id="resource-example-resolve"
            payload={1234}
          >
            {(resource) => <Json>{resource}</Json>}
          </Resource>
        ),
      },
      {
        label: 'Example rejected',
        content: (
          <Resource name="Resource example" id="resource-example-reject">
            {(resource) => <Json>{resource}</Json>}
          </Resource>
        ),
      },
      {
        label: 'Contact',
        content: (
          <Contact id="foo">{(contact) => <Json>{contact}</Json>}</Contact>
        ),
      },
      {
        label: 'Company',
        content: (
          <Company id="bar">{(company) => <Json>{company}</Json>}</Company>
        ),
      },
    ]}
  />
)
