import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'

import usageReadme from '../usage.md'
import exampleReadme from '../example.md'

import FieldInput from '../../Form/elements/FieldInput'
import FormStateful from '../../Form/FormStateful'

import blueTheme from '../../PersonalisedDashboard/blue-theme'

import NotificationBadge from 'NotificationBadge'
import ToggleSection from 'ToggleSection'

storiesOf('ToggleSection', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
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
  .add('As Box - Single (with badge)', () => (
    <ThemeProvider theme={blueTheme}>
      <ToggleSection
        label="Toggle me"
        id="toggle.four"
        isOpen={true}
        badge={<NotificationBadge label="15" />}
      >
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
    </ThemeProvider>
  ))
  .add('As Box - Multiple', () => (
    <ThemeProvider theme={blueTheme}>
      <ToggleSection label="Toggle me" id="toggle.five" isOpen={true}>
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
      <ToggleSection label="Toggle me" id="toggle.six">
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
    </ThemeProvider>
  ))
