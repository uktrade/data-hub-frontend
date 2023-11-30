import React from 'react'

import FieldAddAnother from '../FieldAddAnother'
import FieldTypeahead from '../FieldTypeahead'
import FieldInput from '../FieldInput'
import Form from '../../../Form'
import Step from '../Step'
import { transformArrayToObject } from '../FieldAddAnother/utils'

import usageReadme from '../FieldAddAnother/usage.md'

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

export default {
  title: 'Form/Form Elements/FieldAddAnother',
}

export const DocsPlaceholder = () => (
  <p>
    This is a workaround to get the DocsPage to work with multiInstance
    components.
  </p>
)

DocsPlaceholder.story = {
  name: 'Docs placeholder',
}

export const Edit = () => (
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
          limitChildGroupCount={4}
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
)

Edit.story = {
  parameters: {
    docs: {
      storyDescription: usageReadme,
    },
  },
}

export const New = () => (
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
)

export const MultiStep = () => (
  <Form
    id="fieldAddAnotherMultiStepExample"
    submissionTaskName="Submit Form example"
    initialValues={{
      'added-another-input_0': 'Initial value 0',
      'added-another-input_1': 'Initial value 1',
      'added-another-input_2': 'Initial value 2',
    }}
  >
    {({ values }) => (
      <>
        <Step name="step-1">
          Step 1
          <FieldInput label="Step 1 input" name="step-1-input" />
        </Step>
        <Step name="step-2">
          Step 2
          <FieldInput label="Step 2 input" name="step-2-input" />
          <FieldAddAnother
            itemName="thing"
            initialChildGroupCount={3}
            limitChildGroupCount={7}
          >
            {({ groupIndex }) => (
              <FieldInput
                name={`added-another-input_${groupIndex}`}
                type="text"
                label="Added another"
              />
            )}
          </FieldAddAnother>
        </Step>
        <Step name="step-3">
          Step 3
          <FieldInput label="Step 3 input" name="step-3-input" />
        </Step>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </>
    )}
  </Form>
)
