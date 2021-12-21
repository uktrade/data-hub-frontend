import React from 'react'
import { storiesOf } from '@storybook/react'

import usageReadme from '../usage.md'
import exampleReadme from '../example.md'

import FieldInput from '../../Form/elements/FieldInput'
import TaskForm from '../../Form'

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
      <TaskForm
        id="toggleSectionExample"
        analyticsFormName="toggleSectionExample"
        submissionTaskName="Submit TaskForm example"
      >
        {() => (
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
        )}
      </TaskForm>
    </ToggleSection>
  ))
  .add('Default - Multiple', () => (
    <>
      <ToggleSection label="Toggle me" id="toggle.five" isOpen={true}>
        <TaskForm
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit TaskForm example"
        >
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </TaskForm>
      </ToggleSection>
      <ToggleSection label="Toggle me" id="toggle.six">
        <TaskForm
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit TaskForm example"
        >
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </TaskForm>
      </ToggleSection>
    </>
  ))
  .add('No Highlight - Single', () => (
    <NoHighlightToggleSection label="Toggle me" id="toggle.seven" isOpen={true}>
      <TaskForm
        id="toggleSectionExample"
        analyticsFormName="toggleSectionExample"
        submissionTaskName="Submit TaskForm example"
      >
        {() => (
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
        )}
      </TaskForm>
    </NoHighlightToggleSection>
  ))
  .add('No Highlight - Multiple', () => (
    <>
      <NoHighlightToggleSection
        label="Toggle me"
        id="toggle.eight"
        isOpen={true}
      >
        <TaskForm
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit TaskForm example"
        >
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </TaskForm>
      </NoHighlightToggleSection>
      <NoHighlightToggleSection label="Toggle me" id="toggle.nine">
        <TaskForm
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit TaskForm example"
        >
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </TaskForm>
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
      <TaskForm
        id="toggleSectionExample"
        analyticsFormName="toggleSectionExample"
        submissionTaskName="Submit TaskForm example"
      >
        {() => (
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
        )}
      </TaskForm>
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
        <TaskForm
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit TaskForm example"
        >
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </TaskForm>
      </DashboardToggleSection>
      <DashboardToggleSection label="Toggle me" id="toggle.three">
        <TaskForm
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit TaskForm example"
        >
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </TaskForm>
      </DashboardToggleSection>
    </>
  ))
