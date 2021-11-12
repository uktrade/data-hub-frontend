import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import { Step } from '../../../'

import TaskForm from '..'
import FieldInput from '../../../Form/elements/FieldInput'
import FieldSelect from '../../../Form/elements/FieldSelect'
import FieldRadios from '../../../Form/elements/FieldRadios'

import rejectInitialValuesReadme from './reject-initial-values.md'
import basicExampleReadme from './basic-example.md'
import initialValuesAsPropExampleReadme from './initial-values-as-prop.md'
import softRedirectExampleReadme from './soft-redirect.md'
import multiStepExampleReadme from './multi-step.md'

storiesOf('Task/Form', module)
  .add(
    'Basics',
    () => (
      <TaskForm
        id="task-form-example-resolve-initial-values"
        submissionTaskName="Submit TaskForm example"
        initialValuesTaskName="Load initial values"
        initialValuesPayload="resolve"
        transformInitialValues={(initialValues) => ({
          ...initialValues,
          reject: 'yes',
        })}
        analyticsFormName="task-form-example"
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
          hint='Initial value shold be "Blah Blah"'
          required="Foo is required"
        />
        <FieldSelect
          name="bar"
          label="Bar"
          hint='Initial value shold be "B".'
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
      </TaskForm>
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
      <TaskForm
        id="task-form-example-reject-initial-values"
        submissionTaskName="Submit TaskForm example"
        initialValuesTaskName="Load initial values"
        initialValuesPayload="reject"
        analyticsFormName="task-form-example"
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
      </TaskForm>
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
      <TaskForm
        id="task-form-example-initialValues-prop"
        submissionTaskName="Submit TaskForm example"
        analyticsFormName="task-form-example"
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
      </TaskForm>
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
      <TaskForm
        id="task-form-example-multi-step"
        submissionTaskName="Submit TaskForm example"
        initialValuesTaskName="Load initial values"
        initialValuesPayload="resolve"
        transformInitialValues={(initialValues) => ({
          ...initialValues,
          reject: 'yes',
        })}
        analyticsFormName="Example"
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
            hint='Initial value shold be "Blah Blah"'
            required="Foo is required"
          />
        </Step>
        <Step name="step-2">
          <FieldSelect
            name="bar"
            label="Bar"
            hint='Initial value shold be "B".'
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
      </TaskForm>
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
          <TaskForm
            id="task-form-example-resolve-initial-values"
            submissionTaskName="Submit TaskForm example"
            initialValuesTaskName="Load initial values"
            initialValuesPayload="resolve"
            redirectMode="soft"
            transformInitialValues={(initialValues) => ({
              ...initialValues,
              reject: 'yes',
            })}
            analyticsFormName="task-form-example"
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
              hint='Initial value shold be "Blah Blah"'
              required="Foo is required"
            />
            <FieldSelect
              name="bar"
              label="Bar"
              hint='Initial value shold be "B".'
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
          </TaskForm>
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
