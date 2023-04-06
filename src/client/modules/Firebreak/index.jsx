import React from 'react'
import { TASK_SAVE_FIREBREAK } from './state'
import { DefaultLayout, FieldInput, Form } from '../../components'

const FirebreakForm = ({}) => {
  return (
    <DefaultLayout
      heading="Example api error form"
      pageTitle="Example api error form"
      breadcrumbs={[]}
    >
      <Form
        id="firebreak-form"
        analyticsFormName={'example'}
        cancelRedirectTo={() => ''}
        redirectTo={() => ''}
        submissionTaskName={TASK_SAVE_FIREBREAK}
      >
        {({ errors }) => (
          <>
            <span>{JSON.stringify(errors)}</span>
            <FieldInput name="title" label="Title" type="text" />
          </>
        )}
      </Form>
    </DefaultLayout>
  )
}

export default FirebreakForm
