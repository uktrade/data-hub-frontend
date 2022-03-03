import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import { Form } from '../../../../../client/components'
import FieldAdvisersTypeahead from '../../../../../client/components/Form/elements/FieldAdvisersTypeahead'
import urls from '../../../../../lib/urls'
import { TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER } from './state'
import { GlobalAccountManagerDetails } from './GlobalAccountManagerDetails'
import {
  transformAdviserForTypeahead,
  transformAdviserForAPI,
} from './transformers'

const StyledLegend = styled('legend')`
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 20px;
  font-size: 24px;
`

const EditClientRelationshipManagement = ({
  id,
  clientRelationshipManager,
  globalAccountManager,
  oneListEmail,
}) => (
  <Form
    id="edit-client-relationship-management-form"
    analyticsFormName="editClientRelationshipManagement"
    redirectTo={() => urls.investments.projects.team(id)}
    flashMessage={() => 'Investment details updated'}
    cancelButtonLabel="Back"
    cancelRedirectTo={() => urls.investments.projects.team(id)}
    initialValues={{
      client_relationship_manager: transformAdviserForTypeahead(
        clientRelationshipManager
      ),
    }}
    submissionTaskName={TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER}
    transformPayload={(values) => ({
      id,
      clientRelationshipManagerId: transformAdviserForAPI(
        values.client_relationship_manager
      ),
    })}
  >
    <StyledLegend>Edit client relationship management</StyledLegend>
    <FieldAdvisersTypeahead
      name="client_relationship_manager"
      label="Client Relationship Manager"
      placeholder="Search client relationship manager"
      required="Enter a client relationship manager"
    />
    <GlobalAccountManagerDetails
      oneListEmail={oneListEmail}
      globalAccountManager={globalAccountManager}
    />
  </Form>
)

EditClientRelationshipManagement.propTypes = {
  id: PropTypes.string.isRequired,
  clientRelationshipManager: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  globalAccountManager: PropTypes.shape({
    name: PropTypes.string,
  }),
  oneListEmail: PropTypes.string.isRequired,
}
export default EditClientRelationshipManagement
