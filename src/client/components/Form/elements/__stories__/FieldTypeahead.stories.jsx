import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'

import FormStateful from '../../FormStateful'
import FieldTypeahead from '../FieldTypeahead'

import exampleReadme from '../FieldTypeahead/example.md'
import usageReadme from '../FieldTypeahead/usage.md'

addDecorator(withKnobs)

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Holly Clins - olHeart of the South West LEP',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Bernard Harris-Patelc - Welsh Government (Investment)',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Dennis Kennedy',
  },
]

const getOptions = () =>
  new Promise((resolve) => setTimeout(resolve, 1000, options))

storiesOf('Forms/Typeahead', module)
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
          <FieldTypeahead
            label="Typeahead - sync single value"
            hint="Some hint"
            name="sync_single"
            required="Choose value"
            options={options}
          />
          <FieldTypeahead
            label="Typeahead - sync multi value"
            hint="Some hint"
            name="sync_multi"
            required="Choose value"
            options={options}
            isMulti={true}
          />
          <FieldTypeahead
            label="Typeahead - initial value"
            hint="Some hint"
            name="sync_single"
            required="Choose value"
            initialValue={options[1]}
            options={options}
          />
          <FieldTypeahead
            label="Typeahead - async single value"
            hint="Some hint"
            name="async_single"
            required="Choose value"
            loadOptions={getOptions}
          />
          <FieldTypeahead
            label="Typeahead - async multi value"
            hint="Some hint"
            name="async_multi"
            required="Choose value"
            loadOptions={getOptions}
            isMulti={true}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
