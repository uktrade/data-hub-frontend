import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions/dist/index'
import { object, text, withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'

import FieldSelect from '../FieldSelect'
import FormStateful from '../FormStateful'

addDecorator(withKnobs)

import exampleReadme from '../FieldSelect/example.md'
import usageReadme from '../FieldSelect/usage.md'

storiesOf('Forms/Select', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(form) => (
        <>
          <FieldSelect
            name="testField"
            label="Test select"
            hint="Some hint"
            initialValue={text('Initial value', 'testOptionValue2')}
            emptyOption={text('emptyOption', 'Please select')}
            options={object('options', [
              { label: 'testOptionLabel1', value: 'testOptionValue1' },
              { label: 'testOptionLabel2', value: 'testOptionValue2' },
            ])}
            required="Select one of the options"
            validate={(value) =>
              value !== 'testOptionValue2'
                ? text('error', 'You need to select testOptionValue2')
                : null
            }
          />

          <FieldSelect
            name="testField2"
            label="Test select with children"
            hint="Some hint"
            emptyOption={text('emptyOption', 'Please select')}
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
                ? text('error', 'You need to select testOptionValue2')
                : null
            }
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
