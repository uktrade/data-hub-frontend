import React from 'react'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { FormStateful, FieldRadios, FormActions } from 'data-hub-components'
import { connect } from 'react-redux'
import Task from '../../../client/components/Task'

import { PIPELINE__CHECKED_IF_ON_PIPELINE } from '../../../client/actions'
import { state2props } from './state'
import urls from '../../../lib/urls'

function saveCompanyToPipeline() {
  return async () => {
    // TODO: need to post tp the pipelines endpoint once it is built following the example below:
    // await axios.patch(`/api-proxy/v4/company/${companyId}`, {
    //   [EXPORT_WIN_FIELD_NAME]: status[EXPORT_WIN_FIELD_NAME] || null,
    // })

    return urls.dashboard()
    // TODO: I need to set an error message in the state and show the error here in this component if there was a problem with the post request
  }
}

function AddToPipelineForm({ companyId, companyName, isOnPipeline }) {
  return (
    <Task.Status
      name="Check if on pipeline"
      id="checkIfOnPipeline"
      progressMessage="checking pipeline..."
      startOnRender={{
        payload: { companyId },
        onSuccessDispatch: PIPELINE__CHECKED_IF_ON_PIPELINE,
      }}
    >
      {() =>
        isOnPipeline ? (
          <>
            <p>{companyName} is already in your pipeline</p>
            <p>
              <a href={urls.companies.detail(companyId)}>
                Go back to {companyName}
              </a>
            </p>
            <p>
              <a href={urls.dashboard()}>Go to your dashboard</a>
            </p>
          </>
        ) : (
          <FormStateful onSubmit={saveCompanyToPipeline()}>
            <FieldRadios
              name="category"
              label="Choose a status"
              required="Choose a status"
              options={[
                { value: 'lead', label: 'Lead' },
                { value: 'in_progress', label: 'In progress' },
                { value: 'win', label: 'Win' },
              ]}
            />
            <FormActions>
              <Button>Add</Button>
              <Link href={urls.companies.detail(companyId)}>Cancel</Link>
            </FormActions>
          </FormStateful>
        )
      }
    </Task.Status>
  )
}

export default connect(state2props)(AddToPipelineForm)
