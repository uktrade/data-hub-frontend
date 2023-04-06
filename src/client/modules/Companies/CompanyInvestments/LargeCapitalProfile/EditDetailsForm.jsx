import React from 'react'
import PropTypes from 'prop-types'
import urls from '../../../../../lib/urls'
import Form from '../../../../components/Form'
import { Main } from '../../../../components'

const EditDetailsForm = ({ companyId }) => {
  return (
    <Main>
      <Form
        id="large-capital-profile-details"
        analyticsFormName="largeCapitalProfileDetails"
        cancelRedirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
      >
        <p>Edit details</p>
      </Form>
    </Main>
  )
}
EditDetailsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default EditDetailsForm
