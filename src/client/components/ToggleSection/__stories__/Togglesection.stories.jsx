import React from 'react'
import { storiesOf } from '@storybook/react'

import FieldInput from '../../Form/elements/FieldInput'
import FormStateful from '../../Form/FormStateful'

import ToggleSection from 'ToggleSection'

storiesOf('ToggleSection', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Single', () => (
    <ToggleSection label="Toggle me" id="toggle.one" isOpen={true}>
      <FormStateful>
        {() => (
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
        )}
      </FormStateful>
    </ToggleSection>
  ))
  .add('Multiple', () => (
    <>
      <ToggleSection label="Toggle me" id="toggle.two" isOpen={true}>
        <FormStateful>
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </FormStateful>
      </ToggleSection>
      <ToggleSection label="Toggle me" id="toggle.three">
        <FormStateful>
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </FormStateful>
      </ToggleSection>
    </>
  ))
