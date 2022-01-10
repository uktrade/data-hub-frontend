import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import Form from '../index'
import FieldInput from '../elements/FieldInput'
import FieldSelect from '../elements/FieldSelect'
import FieldRadios from '../elements/FieldRadios'
import FieldCheckboxes from '../elements/FieldCheckboxes'
import FieldTypeahead from '../elements/FieldTypeahead'
import Step from '../elements/Step'

import rejectInitialValuesReadme from './reject-initial-values.md'
import basicExampleReadme from './basic-example.md'
import initialValuesAsPropExampleReadme from './initial-values-as-prop.md'
import softRedirectExampleReadme from './soft-redirect.md'
import multiStepExampleReadme from './multi-step.md'
import ResourceOptionsField from '../elements/ResourceOptionsField'

import Resource from '../../Resource'

const DummyResource = (props) => <Resource {...props} name="Load options" />

storiesOf('Form', module)
  .add('Resource options fields', () => (
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
  ))
  .add(
    'Basics',
    () => (
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
          This example redirects to the same path with the result of the
          submission task together with the submitted form values JSON
          serialized in the URL fragment.
        </p>
        <p>
          Note that the expected result of a resolved submission is a hard
          redirection, which can only be seen in Storybook when the canvas is
          open in it's own tab.
        </p>
        <p>
          The form stays in the progress state until the next page is loaded
        </p>
      </Form>
    ),
    {
      readme: {
        sidebar: basicExampleReadme,
      },
    }
  )
  .add(
    'Rejected initial values',
    () => (
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
    ),
    {
      readme: {
        sidebar: rejectInitialValuesReadme,
      },
    }
  )
  .add(
    'Initial values passed as prop',
    () => (
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
        <FieldInput
          name="foo"
          type="text"
          label="Foo"
          required="Foo is required"
        />
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
    ),
    {
      readme: {
        sidebar: initialValuesAsPropExampleReadme,
      },
    }
  )
  .add(
    'Multi step',
    () => (
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
    ),
    {
      readme: {
        sidebar: multiStepExampleReadme,
      },
    }
  )
  .add(
    'Soft (React-Router) redirect',
    () => (
      <Switch>
        <Route path="/iframe.html">
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
        </Route>
        <Route path="/success">
          The submission task resolved
          <br />
          <Link to="/iframe.html">Back to form</Link>
        </Route>
      </Switch>
    ),
    {
      readme: {
        sidebar: softRedirectExampleReadme,
      },
    }
  )
