import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'

import FormStateful from '../../FormStateful'
import FieldAddAnother from '../FieldAddAnother'
import Typeahead from '../../../Typeahead/Typeahead'

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

storiesOf('Forms/FieldAddAnother', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(state) => (
        <>
          <FieldAddAnother
            name="related_trade_agreements"
            label="Related Trade Agreements"
            data-test-prefix="trade-agreement-field-"
            required="Select at least one Trade Agreement"
          >
            {({ value, onChange, error }) => (
              <Typeahead
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
          <Button>Submit</Button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
