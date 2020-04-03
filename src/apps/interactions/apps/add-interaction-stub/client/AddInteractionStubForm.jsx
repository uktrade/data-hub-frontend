import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'
import moment from 'moment'
import axios from 'axios'

import {
  FieldRadios,
  FieldSelect,
  FieldInput,
  FormStateful,
  Step,
  FieldCheckboxes,
  FieldTypeahead,
  FieldTextarea,
} from 'data-hub-components'

import FieldDate from 'data-hub-components/dist/forms/elements/FieldDate'

import {
  KINDS,
  INTERACTION_STATUS,
} from '../../../constants'

const onSubmit = async (values, companyId, csrfToken) => {
    const postData = {
        'kind': KINDS.INTERACTION,
        'company': {'id': companyId},
        'contacts': values['contacts'].map(item => ({'id': item['value']})),
        'date': [values['date']['year'], values['date']['month'], values['date']['day']].join('-'),
            
        'dit_participants': values['advisers'].map(item => ({'adviser': {'id': item['value']}})),
        'subject': values['subject'],
        'was_policy_feedback_provided': false,
        'status': INTERACTION_STATUS.DRAFT,
    }
    const response = await axios({
      method: 'POST',
      url: '/api-proxy/v3/interaction',
      data: { ...postData, _csrf: csrfToken },
    })
    // TODO: Handle errors gracefully here
    // TODO: Remove URL hardcoding
    return '/interactions/' + response['data']['id']
}

const AddInteractionStubForm = ({
  company,
  contacts,
  initialContacts,
  advisers,
  initialAdvisers,
  initialDate,
  initialSubject,
  csrfToken,
}) => {
  return (
    <FormStateful
      initialValues={{
        date: initialDate,
        advisers: initialAdvisers,
        contacts: initialContacts,
        subject: initialSubject,
      }}
      onSubmit={(values) => onSubmit(values, company['id'], csrfToken)}
    >
      {({ values }) => {

        return (
          <>

            <Step name="interaction_details" forwardButton="Add stub interaction">
              <H3 as="h2">Participants</H3>

              <FieldTypeahead
                name="contacts"
                label="Contact(s)"
                placeholder="-- Select contact --"
                required="Select at least one contact"
                options={contacts}
                isMulti={true}
              />

              <FieldTypeahead
                name="advisers"
                label="Adviser(s)"
                placeholder="-- Select adviser --"
                required="Select at least one adviser"
                options={advisers}
                isMulti={true}
              />

              <H3 as="h2">Details</H3>

              <FieldDate
                name="date"
                label="Date of interaction"
                required="Enter a valid date"
              />

              <FieldInput
                type="text"
                name="subject"
                label="Subject"
                required="Enter a subject"
              />

            </Step>
          </>
        )
      }}
    </FormStateful>
  )
}

const typeaheadOptionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

const typeaheadOptionsListProp = PropTypes.arrayOf(typeaheadOptionProp)

AddInteractionStubForm.propTypes = {
  advisers: typeaheadOptionsListProp.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default AddInteractionStubForm
