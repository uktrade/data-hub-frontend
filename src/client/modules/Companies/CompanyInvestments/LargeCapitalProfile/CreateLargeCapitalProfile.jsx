import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../lib/urls'
import Form from '../../../../components/Form'
import { Main } from '../../../../components'
import { TASK_CREATE_LARGE_CAPITAL_PROFILE } from './state'
import { transformIdForApi } from './transformers'

const CreateLargeCapitalProfile = ({ companyId }) => {
  return (
    <Main>
      <Form
        id="large-capital-profile-create"
        analyticsFormName="createLargeCapitalProfile"
        submitButtonLabel="Create a profile"
        redirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
        transformPayload={() => transformIdForApi(companyId)}
        submissionTaskName={TASK_CREATE_LARGE_CAPITAL_PROFILE}
      />
    </Main>
  )
}
CreateLargeCapitalProfile.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default CreateLargeCapitalProfile
