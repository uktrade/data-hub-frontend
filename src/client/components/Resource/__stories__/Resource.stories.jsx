import React from 'react'

import Form from '../../Form'
import TabNav from '../../TabNav'
import Contact from '../Contact'
import Company from '../Company'
import Resource from '../Resource'
import { InlineTemplate } from '../../Task/__stories__/utils'
import Countries from '../Countries'
import BusinessPotential from '../BusinessPotential'

const Json = ({ children }) => <pre>{JSON.stringify(children, null, 2)}</pre>

export default {
  title: 'Resource',
  component: Resource,
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

export const CustomProgressAndError = () => (
  <Contact
    id="foo"
    taskStatusProps={{
      renderProgress: () => 'loading...',
      renderError: ({ retry, dismiss, errorMessage, noun }) => (
        <div
          style={{ border: '4px solid green', background: 'gold', padding: 10 }}
        >
          <div>Couldn't load {noun} because:</div>
          <pre>{errorMessage}</pre>
          <button onClick={retry}>retry</button>
          <button onClick={dismiss}>dismiss</button>
        </div>
      ),
    }}
  >
    {(contact) => <Json>{contact}</Json>}
  </Contact>
)

const ContactName = (props) => (
  <Contact.Inline {...props}>
    {({ firstName, lastName }) => `${firstName} ${lastName}`}
  </Contact.Inline>
)

export const Inline = () => (
  <InlineTemplate
    dismissable={<ContactName id="foo" />}
    noRetry={<ContactName id="foo" dismissable={false} noRetry={true} />}
  />
)

export const MetadataFormFields = () => (
  <Form id="my-form">
    {({ values }) => (
      <>
        <Countries.FieldSelect name="countrySelect" label="Country" />
        <Countries.FieldTypeahead name="countryTypeahead" label="Country" />
        <BusinessPotential.FieldRadios
          name="businessPotentialRadios"
          label="Business potential"
        />
        <BusinessPotential.FieldCheckboxes
          name="businessPotentialCheckboxes"
          label="Business potential"
        />
        <Json>{values}</Json>
      </>
    )}
  </Form>
)
