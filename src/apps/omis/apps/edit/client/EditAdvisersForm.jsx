import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldAdvisersTypeahead,
  Form,
  LocalHeader,
} from '../../../../../client/components'
import urls from '../../../../../lib/urls.js'

export const EditAdvisersLocalHeader = ({
  orderId,
  heading,
  lastFieldText,
  reference,
}) => (
  <LocalHeader
    heading={heading}
    breadcrumbs={[
      { link: urls.dashboard(), text: 'Home' },
      { link: urls.omis.index(), text: 'Orders (OMIS)' },
      { link: urls.omis.workOrder(orderId), text: reference },
      { text: lastFieldText },
    ]}
  />
)

export const EditAdvisersForm = ({
  id,
  analyticsFormName,
  initialValues,
  submissionTaskName,
  transformPayload,
  orderAdvisers,
  typeaheadName,
  typeaheadHint,
  orderId,
}) => (
  <Form
    id={id}
    analyticsFormName={analyticsFormName}
    submitButtonLabel="Save and return"
    cancelRedirectTo={() => urls.omis.workOrder(orderId)}
    cancelButtonLabel="Return without saving"
    initialValues={initialValues}
    submissionTaskName={submissionTaskName}
    redirectTo={() => urls.omis.workOrder(orderId)}
    flashMessage={() => 'Changes saved'}
    transformPayload={transformPayload}
  >
    <FieldAdvisersTypeahead
      name={typeaheadName}
      label="Adviser"
      /*
        We need to allow the users to remove all advisers without adding new ones.
        Therefore validation is only enabled when the order has no pre-existing advisers. 
      */
      required={orderAdvisers.length ? null : 'Enter at least one team member'}
      placeholder="Search team member"
      hint={typeaheadHint}
      isMulti={true}
    />
  </Form>
)

EditAdvisersForm.propTypes = {
  id: PropTypes.string.isRequired,
  submissionTaskName: PropTypes.string.isRequired,
  analyticsFormName: PropTypes.string.isRequired,
  transformPayload: PropTypes.func.isRequired,
  orderAdvisers: PropTypes.array.isRequired,
  orderId: PropTypes.string.isRequired,
  typeaheadName: PropTypes.string.isRequired,
  typeaheadHint: PropTypes.string.isRequired,
}

EditAdvisersLocalHeader.propTypes = {
  orderId: PropTypes.string.isRequired,
  reference: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  lastFieldText: PropTypes.string.isRequired,
}
