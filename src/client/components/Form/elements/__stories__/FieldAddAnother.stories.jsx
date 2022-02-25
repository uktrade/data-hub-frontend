import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import FieldAddAnother from '../FieldAddAnother'
import FieldTypeahead from '../FieldTypeahead'
import FieldInput from '../FieldInput'
import Form from '../../../Form'
import { transformArrayToObject } from '../FieldAddAnother/utils'

import exampleReadme from '../FieldAddAnother/example.md'
import usageReadme from '../FieldAddAnother/usage.md'

addDecorator(withKnobs)

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Bob Bobertson',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Mary Maryson',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Jane Doe',
  },
]

const initialValues = [
  {
    adviser_0: {
      label: 'Bob Bobertson',
      value: '1379f390a-e083-4a2c-9cea-e3b9a08606a723',
    },
    role_0: 'Boss',
  },
  {
    adviser_1: {
      label: 'Mary Maryson',
      value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    },
    role_1: 'Minion',
  },
]

const transformObjectBackToArray = (valueAsObject) => {
  return Object.entries(valueAsObject).reduce((acc, [key, val]) => {
    const rootKey = key.replace(/_./gm, '')
    acc.push({ [rootKey]: val })
    return acc
  }, [])
}

storiesOf('Form/Form Elements/FieldAddAnother', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Edit', () => (
    <Form
      id="fieldAddAnotherExample"
      analyticsFormName="fieldAddAnotherExample"
      submissionTaskName="Submit Form example"
      initialValues={transformArrayToObject(initialValues)}
    >
      {(state) => (
        <>
          <FieldAddAnother
            name="teams_edit-example"
            legend="Team members with roles"
            dataTestPrefix="teams-field-"
            itemName="team member"
            initialChildGroupCount={initialValues.length}
          >
            {({ groupIndex }) => (
              <>
                <FieldTypeahead
                  name={`adviser_${groupIndex}`}
                  inputId={`adviser_${groupIndex}`}
                  label="Team Member"
                  options={options}
                  placeholder="Search advisers"
                  required="Select at least one Adviser"
                  aria-label="Select an adviser"
                />
                <FieldInput
                  name={`role_${groupIndex}`}
                  type="text"
                  label="Role"
                />
              </>
            )}
          </FieldAddAnother>
          <pre>
            Using the data with the form setting and getting values{' '}
            {JSON.stringify(state.values, null, 2)}
          </pre>
          <pre>
            When sending data back to the database
            {JSON.stringify(transformObjectBackToArray(state.values), null, 2)}
          </pre>
        </>
      )}
    </Form>
  ))
  .add('New', () => (
    <Form
      id="fieldAddAnotherExample"
      analyticsFormName="fieldAddAnotherExample"
      submissionTaskName="Submit Form example"
    >
      {(state) => (
        <>
          <FieldAddAnother
            name="teams_new_edit_example"
            legend="Team members with roles"
            dataTestPrefix="teams-field-"
            itemName="team member"
          >
            {({ groupIndex }) => (
              <>
                <FieldTypeahead
                  name={`adviser_${groupIndex}`}
                  inputId={`adviser_${groupIndex}`}
                  label="Team Member"
                  options={options}
                  placeholder="Search advisers"
                  required="Select at least one Adviser"
                  aria-label="Select an adviser"
                />
                <FieldInput
                  name={`role_${groupIndex}`}
                  type="text"
                  label="Role"
                />
              </>
            )}
          </FieldAddAnother>
          <pre>
            Using the data with the form setting and getting values{' '}
            {JSON.stringify(state.values, null, 2)}
          </pre>
          <pre>
            When sending data back to the database
            {JSON.stringify(transformObjectBackToArray(state.values), null, 2)}
          </pre>
        </>
      )}
    </Form>
  ))
