import React from 'react'
import PropTypes from 'prop-types'
import urls from '../../../../../lib/urls'
import Form from '../../../../components/Form'
import { Main } from '../../../../components'

const EditLocationForm = ({ companyId }) => {
  return (
    <Main>
      <Form
        id="large-capital-profile-location"
        analyticsFormName="largeCapitalProfileLocation"
        cancelRedirectTo={() =>
          urls.companies.investments.largeCapitalProfile(companyId)
        }
      >
        <p>Edit location</p>
      </Form>
    </Main>
  )
}
EditLocationForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default EditLocationForm
