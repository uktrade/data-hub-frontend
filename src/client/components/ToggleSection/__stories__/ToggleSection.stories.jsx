import React from 'react'
import { storiesOf } from '@storybook/react'

import usageReadme from '../usage.md'
import exampleReadme from '../example.md'

import FieldInput from '../../Form/elements/FieldInput'
import FormStateful from '../../Form/FormStateful'

import NotificationBadge from 'NotificationBadge'
import {
  DashboardToggleSection,
  NoHighlightToggleSection,
  ToggleSection,
} from 'ToggleSection'

storiesOf('ToggleSection', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default - Single', () => (
    <ToggleSection label="Toggle me" id="toggle.four" isOpen={true}>
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
  .add('Default - Multiple', () => (
    <>
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
    </>
  ))
  .add('No Highlight - Single', () => (
    <NoHighlightToggleSection label="Toggle me" id="toggle.seven" isOpen={true}>
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
    </NoHighlightToggleSection>
  ))
  .add('No Highlight - Multiple', () => (
    <>
      <NoHighlightToggleSection
        label="Toggle me"
        id="toggle.eight"
        isOpen={true}
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
      </NoHighlightToggleSection>
      <NoHighlightToggleSection label="Toggle me" id="toggle.nine">
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
      </NoHighlightToggleSection>
    </>
  ))
  .add('Dashboard - Single (with badge)', () => (
    <DashboardToggleSection
      label="Toggle me"
      id="toggle.one"
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
    </DashboardToggleSection>
  ))
  .add('Dashboard - Multiple', () => (
    <>
      <DashboardToggleSection
        label="Toggle me"
        id="toggle.two"
        isOpen={true}
        major={true}
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
      </DashboardToggleSection>
      <DashboardToggleSection label="Toggle me" id="toggle.three">
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
      </DashboardToggleSection>
    </>
  ))
