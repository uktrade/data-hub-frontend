import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import FieldAddAnother from '../FieldAddAnother'
import Typeahead from '../../../Typeahead/Typeahead'
import Form from '../../../Form'

import exampleReadme from '../FieldAddAnother/example.md'
import usageReadme from '../FieldAddAnother/usage.md'

addDecorator(withKnobs)

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Trade agreement 1',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Trade agreement 2',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Trade agreement 3',
  },
]

storiesOf('Form/Form Elements/FieldAddAnother', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <Form
      id="fieldAddAnotherExample"
      analyticsFormName="fieldAddAnotherExample"
      submissionTaskName="Submit Form example"
    >
      {(state) => (
        <>
          <FieldAddAnother
            name="related_trade_agreements"
            label="Related named trade agreement(s)"
            data-test-prefix="trade-agreement-field-"
            required="Select at least one Trade Agreement"
            item-name="trade agreement"
          >
            {({ value, onChange, error }) => (
              <Typeahead
                id="related_trade_agreements_1"
                name="related_trade_agreements"
                inputId="related_trade_agreements"
                label={''}
                options={options}
                placeholder="-- Search trade agreements --"
                required="Select at least one Trade Agreement"
                aria-label="Select a trade agreement"
                value={options.find(
                  ({ value: option_value }) => option_value === value
                )}
                onChange={onChange}
                error={error}
              />
            )}
          </FieldAddAnother>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
