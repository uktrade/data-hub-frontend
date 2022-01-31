import React from 'react'
import { storiesOf } from '@storybook/react'

import FieldSelect from '../FieldSelect'
import FieldInput from '../FieldInput'
import Form from '../../../Form'

import exampleReadme from '../FieldSelect/example.md'
import usageReadme from '../FieldSelect/usage.md'

storiesOf('Form/Form Elements/Select', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <Form
      id="fieldSelectExample"
      analyticsFormName="fieldSelectExample"
      submissionTaskName="Submit Form example"
    >
      {(form) => (
        <>
          <FieldSelect
            name="testField"
            label="Test select"
            hint="Some hint"
            initialValue={'testOptionValue2'}
            emptyOption={'Please select'}
            options={[
              { label: 'testOptionLabel1', value: 'testOptionValue1' },
              { label: 'testOptionLabel2', value: 'testOptionValue2' },
            ]}
            required="Select one of the options"
            validate={(value) =>
              value !== 'testOptionValue2'
                ? 'You need to select testOptionValue2'
                : null
            }
          />

          <FieldSelect
            name="testField2"
            label="Test select with children"
            hint="Some hint"
            emptyOption={'Please select'}
            options={[
              { label: 'Option 1', value: 'o1' },
              { label: 'Option 2', value: 'o2' },
              {
                label: 'Other',
                value: 'other',
                children: (
                  <FieldInput
                    type="text"
                    placeholder="Define other"
                    name="other"
                  />
                ),
              },
            ]}
            required="Select one of the options"
            validate={(value) =>
              value !== 'testOptionValue2'
                ? 'You need to select testOptionValue2'
                : null
            }
          />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
