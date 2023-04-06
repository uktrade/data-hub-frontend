import React from 'react'
import PropTypes from 'prop-types'
import urls from '../../../../../lib/urls'
import Form from '../../../../components/Form'
import { Main } from '../../../../components'

const EditRequirementsForm = ({ companyId }) => (
  <Main>
    <Form
      id="large-capital-profile-requirements"
      analyticsFormName="largeCapitalProfileRequirements"
      cancelRedirectTo={() =>
        urls.companies.investments.largeCapitalProfile(companyId)
      }
    >
      <p>Edit requirements</p>
    </Form>
  </Main>
)

EditRequirementsForm.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default EditRequirementsForm
