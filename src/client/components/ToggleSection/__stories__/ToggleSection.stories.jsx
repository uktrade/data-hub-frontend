import React from 'react'
import { storiesOf } from '@storybook/react'

import usageReadme from './usage.md'

import FieldInput from '../../Form/elements/FieldInput'
import Form from '../../Form'

import NotificationBadge from 'NotificationBadge'
import {
  DashboardToggleSection,
  FilterToggleSection,
  NoHighlightToggleSection,
  ToggleSection,
} from 'ToggleSection'

storiesOf('ToggleSection', module)
  .add('Docs placeholder', () => (
    <p>
      This is a workaround to get the DocsPage to work with multiInstance
      components.
    </p>
  ))
  .add(
    'Default - Single',
    () => (
      <ToggleSection label="Toggle me" id="toggle.four" isOpen={true}>
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </ToggleSection>
    ),
    {
      docs: {
        storyDescription: usageReadme,
      },
    }
  )
  .add('Default - Multiple', () => (
    <>
      <ToggleSection label="Toggle me" id="toggle.five" isOpen={true}>
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </ToggleSection>
      <ToggleSection label="Toggle me" id="toggle.six">
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </ToggleSection>
    </>
  ))
  .add('No Highlight - Single', () => (
    <NoHighlightToggleSection label="Toggle me" id="toggle.seven" isOpen={true}>
      <Form
        id="toggleSectionExample"
        analyticsFormName="toggleSectionExample"
        submissionTaskName="Submit Form example"
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
      </Form>
    </NoHighlightToggleSection>
  ))
  .add('No Highlight - Multiple', () => (
    <>
      <NoHighlightToggleSection
        label="Toggle me"
        id="toggle.eight"
        isOpen={true}
      >
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </NoHighlightToggleSection>
      <NoHighlightToggleSection label="Toggle me" id="toggle.nine">
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </NoHighlightToggleSection>
    </>
  ))
  .add('Dashboard - Single (with badge)', () => (
    <DashboardToggleSection
      label="Toggle me"
      id="toggle.one"
      isOpen={true}
      badge={<NotificationBadge value={15} />}
    >
      <Form
        id="toggleSectionExample"
        analyticsFormName="toggleSectionExample"
        submissionTaskName="Submit Form example"
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
      </Form>
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
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </DashboardToggleSection>
      <DashboardToggleSection label="Toggle me" id="toggle.three">
        <Form
          id="toggleSectionExample"
          analyticsFormName="toggleSectionExample"
          submissionTaskName="Submit Form example"
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
        </Form>
      </DashboardToggleSection>
    </>
  ))
  .add('Filter - Single', () => (
    <FilterToggleSection label="Toggle me" id="toggle.eight" isOpen={true}>
      <p>Some filters</p>
    </FilterToggleSection>
  ))
  .add('Filter - Multiple', () => (
    <>
      <FilterToggleSection label="Toggle me" id="toggle.nine" isOpen={true}>
        <p>Some filters</p>
      </FilterToggleSection>
      <FilterToggleSection label="Toggle me" id="toggle.ten" isOpen={false}>
        <p>Some filters</p>
      </FilterToggleSection>
      <FilterToggleSection label="Toggle me" id="toggle.eleven" isOpen={false}>
        <p>Some filters</p>
      </FilterToggleSection>
    </>
  ))
