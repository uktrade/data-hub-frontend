import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Form from '../index'
import FieldInput from '../elements/FieldInput'
import FieldSelect from '../elements/FieldSelect'
import FieldRadios from '../elements/FieldRadios'
import FieldCheckboxes from '../elements/FieldCheckboxes'
import FieldTypeahead from '../elements/FieldTypeahead'
import Step from '../elements/Step'

import basicExampleReadme from './basic-example.md'
import softRedirectExampleReadme from './soft-redirect.md'
import ResourceOptionsField from '../elements/ResourceOptionsField'

import Resource from '../../Resource/Resource'

const DummyResource = (props) => <Resource {...props} name="Load options" />

export default {
  title: 'Form',
}

export const DocsPlaceholder = () => (
  <p>
    This is a workaround to get the DocsPage to work with multiInstance
    components. The form props are fully documented{' '}
    <a href="https://github.com/uktrade/data-hub-frontend/blob/main/src/client/components/Form/index.jsx#L467">
      in the component's docstring.
    </a>
  </p>
)

DocsPlaceholder.story = {
  name: 'Docs placeholder',
}

export const Basics = () => (
  <Form
    id="task-form-example-resolve-initial-values"
    submissionTaskName="Submit Form example"
    initialValuesTaskName="Load initial values"
    initialValuesPayload="resolve"
    transformInitialValues={(initialValues) => ({
      ...initialValues,
      reject: 'yes',
    })}
    analyticsFormName="formExample"
    redirectTo={(submissionTaskResult, formValues) =>
      '#' + JSON.stringify({ submissionTaskResult, formValues })
    }
    // eslint-disable-next-line no-unused-vars
    flashMessage={(submissionTaskResult, formValues) =>
      'Form was submitted successfully'
    }
  >
    <FieldInput
      name="foo"
      type="text"
      label="Foo"
      hint='Initial value should be "Blah Blah"'
      required="Foo is required"
    />
    <FieldSelect
      name="bar"
      label="Bar"
      hint='Initial value should be "B".'
      required="Bar is required"
      options={[
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ]}
    />
    <FieldRadios
      name="reject"
      label="Reject"
      hint="Should the submission task reject?"
      options={[
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ]}
    />
    <p>
      This example redirects to the same path with the result of the submission
      task together with the submitted form values JSON serialized in the URL
      fragment.
    </p>
    <p>
      Note that the expected result of a resolved submission is a hard
      redirection, which can only be seen in Storybook when the canvas is open
      in it's own tab.
    </p>
    <p>The form stays in the progress state until the next page is loaded</p>
  </Form>
)

Basics.story = {
  parameters: {
    docs: {
      storyDescription: basicExampleReadme,
    },
  },
}

export const ResourceOptionsFields = () => (
  <Form
    id="lazy-field-example"
    submissionTaskName="Submit Form example"
    analyticsFormName="formExample"
    initialValues={{
      select: 'b',
      // radios: 'b',
      // checkboxes: ['a', 'c'],
      typeahead: { label: 'B', value: 'b' },
    }}
  >
    <ResourceOptionsField
      resource={DummyResource}
      field={FieldSelect}
      id="select"
      payload={[
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
        { id: 'c', name: 'C' },
      ]}
      resultToOptions={(result) =>
        result.map(({ id, name }) => ({ value: id, label: name }))
      }
      name="select"
      label="Select"
      hint='Initial value shold be "B".'
      required="Required"
    />
    <ResourceOptionsField
      taskName="Load options"
      field={FieldRadios}
      id="radios"
      payload={[
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
        { id: 'c', name: 'C' },
      ]}
      resultToOptions={(result) =>
        result.map(({ id, name }) => ({ value: id, label: name }))
      }
      name="radios"
      label="Radios"
      hint="Uses taskName instead of resource. Initial value should be 'B'"
      required="Required"
    />
    <ResourceOptionsField
      resource={DummyResource}
      field={FieldCheckboxes}
      id="checkboxes-reject"
      payload={[
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
        { id: 'c', name: 'C' },
      ]}
      resultToOptions={(result) =>
        result.map(({ id, name }) => ({ value: id, label: name }))
      }
      name="checkboxes"
      label="Checkboxes"
      hint="Should Reject."
      required="Required"
    />
    <ResourceOptionsField
      resource={DummyResource}
      field={FieldTypeahead}
      id="typeahead"
      payload={[
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
        { id: 'c', name: 'C' },
      ]}
      resultToOptions={(result) =>
        result.map(({ id, name }) => ({ value: id, label: name }))
      }
      name="typeahead"
      label="Typeahead"
      hint="Default value should be 'b'"
      required="Required"
    />
  </Form>
)

ResourceOptionsFields.story = {
  name: 'Resource options fields',
}

export const RejectedInitialValues = () => (
  <Form
    id="task-form-example-reject-initial-values"
    submissionTaskName="Submit Form example"
    initialValuesTaskName="Load initial values"
    initialValuesPayload="reject"
    analyticsFormName="formExample"
    redirectTo={(submissionTaskResult, formValues) =>
      '#' + JSON.stringify({ submissionTaskResult, formValues })
    }
    // eslint-disable-next-line no-unused-vars
    flashMessage={(submissionTaskResult, formValues) =>
      'Form was submitted successfully'
    }
  >
    <FieldInput name="foo" type="text" label="Foo" />
    <FieldSelect
      name="bar"
      label="Bar"
      options={[
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ]}
    />
  </Form>
)

RejectedInitialValues.story = {
  name: 'Rejected initial values',

  parameters: {
    docs: {
      storyDescription:
        'The `Form` can resolve its initial values with the _task_ mechanism. This example demonstrates the rejection of the initial values task.',
    },
  },
}

export const InitialValuesPassedAsProp = () => (
  <Form
    id="task-form-example-initialValues-prop"
    submissionTaskName="Submit Form example"
    analyticsFormName="formExample"
    initialValues={{ foo: 'Foo', bar: 'b' }}
    redirectTo={(submissionTaskResult, formValues) =>
      '#' + JSON.stringify({ submissionTaskResult, formValues })
    }
    // eslint-disable-next-line no-unused-vars
    flashMessage={(submissionTaskResult, formValues) =>
      'Form was submitted successfully'
    }
  >
    <FieldInput name="foo" type="text" label="Foo" required="Foo is required" />
    <FieldSelect
      name="bar"
      label="Bar"
      required="Bar is required"
      initialValue="c"
      options={[
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ]}
    />
    <FieldInput
      name="baz"
      type="text"
      label="Baz"
      required="Baz is required"
      initialValue="Baz"
    />
  </Form>
)

InitialValuesPassedAsProp.story = {
  name: 'Initial values passed as prop',

  parameters: {
    docs: {
      storyDescription:
        'The initial values of `Form` can also be set with the `initialValues` prop.',
    },
  },
}

export const MultiStep = () => (
  <Form
    id="task-form-example-multi-step"
    submissionTaskName="Submit Form example"
    initialValuesTaskName="Load initial values"
    initialValuesPayload="resolve"
    transformInitialValues={(initialValues) => ({
      ...initialValues,
      reject: 'yes',
    })}
    analyticsFormName="formExample"
    redirectTo={(submissionTaskResult, formValues) =>
      '#' + JSON.stringify({ submissionTaskResult, formValues })
    }
    // eslint-disable-next-line no-unused-vars
    flashMessage={(submissionTaskResult, formValues) =>
      'Form was submitted successfully'
    }
    onSuccess={(result, values) =>
      alert(JSON.stringify({ result, values }, null, 2))
    }
  >
    <Step name="step-1">
      <FieldInput
        name="foo"
        type="text"
        label="Foo"
        hint='Initial value should be "Blah Blah"'
        required="Foo is required"
      />
    </Step>
    <Step name="step-2">
      <FieldSelect
        name="bar"
        label="Bar"
        hint='Initial value should be "B".'
        required="Bar is required"
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ]}
      />
    </Step>
    <Step name="step-3">
      <FieldRadios
        name="reject"
        label="Reject"
        hint="Should the submission task reject?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
      />
    </Step>
  </Form>
)

MultiStep.story = {
  name: 'Multi step',
}

export const SoftReactRouterRedirect = () => (
  <Routes>
    <Route
      path="/iframe.html"
      element={
        <Form
          id="task-form-example-resolve-initial-values"
          submissionTaskName="Submit Form example"
          initialValuesTaskName="Load initial values"
          initialValuesPayload="resolve"
          redirectMode="soft"
          transformInitialValues={(initialValues) => ({
            ...initialValues,
            reject: 'yes',
          })}
          analyticsFormName="formExample"
          // eslint-disable-next-line no-unused-vars
          redirectTo={(submissionTaskResult, formValues) => '/success'}
          // eslint-disable-next-line no-unused-vars
          flashMessage={(submissionTaskResult, formValues) =>
            'Form was submitted successfully'
          }
        >
          <FieldInput
            name="foo"
            type="text"
            label="Foo"
            hint='Initial value should be "Blah Blah"'
            required="Foo is required"
          />
          <FieldSelect
            name="bar"
            label="Bar"
            hint='Initial value should be "B".'
            required="Bar is required"
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
            ]}
          />
          <FieldRadios
            name="reject"
            label="Reject"
            hint="Should the submission task reject?"
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
          />
        </Form>
      }
    />
    <Route
      path="/success"
      element={
        <>
          The submission task resolved
          <br />
          <Link to="/iframe.html">Back to form</Link>
        </>
      }
    />
  </Routes>
)

SoftReactRouterRedirect.story = {
  name: 'Soft (React-Router) redirect',

  parameters: {
    docs: {
      storyDescription: softRedirectExampleReadme,
    },
  },
}
