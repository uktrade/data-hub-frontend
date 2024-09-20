import React from 'react'

import NotificationBadge from '../../NotificationBadge'
import {
  DashboardToggleSection,
  FilterToggleSection,
  NoHighlightToggleSection,
  ToggleSection,
} from '..'

import usageReadme from './usage.md'
import FieldInput from '../../Form/elements/FieldInput'
import Form from '../../Form'

export default {
  title: 'ToggleSection',
}

export const DocsPlaceholder = () => (
  <p>
    This is a workaround to get the DocsPage to work with multiInstance
    components.
  </p>
)

DocsPlaceholder.story = {
  name: 'Docs placeholder',
}

export const DefaultSingle = () => (
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
)

DefaultSingle.story = {
  name: 'Default - Single',

  parameters: {
    docs: {
      storyDescription: usageReadme,
    },
  },
}

export const DefaultMultiple = () => (
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
)

DefaultMultiple.story = {
  name: 'Default - Multiple',
}

export const NoHighlightSingle = () => (
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
)

NoHighlightSingle.story = {
  name: 'No Highlight - Single',
}

export const NoHighlightMultiple = () => (
  <>
    <NoHighlightToggleSection label="Toggle me" id="toggle.eight" isOpen={true}>
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
)

NoHighlightMultiple.story = {
  name: 'No Highlight - Multiple',
}

export const DashboardSingleWithBadge = () => (
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
)

DashboardSingleWithBadge.story = {
  name: 'Dashboard - Single (with badge)',
}

export const DashboardMultiple = () => (
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
)

DashboardMultiple.story = {
  name: 'Dashboard - Multiple',
}

export const FilterSingle = () => (
  <FilterToggleSection label="Toggle me" id="toggle.eight" isOpen={true}>
    <p>Some filters</p>
  </FilterToggleSection>
)

FilterSingle.story = {
  name: 'Filter - Single',
}

export const FilterMultiple = () => (
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
)

FilterMultiple.story = {
  name: 'Filter - Multiple',
}
