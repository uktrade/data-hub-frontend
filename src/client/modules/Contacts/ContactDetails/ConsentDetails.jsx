import React from 'react'
import { isNil } from 'lodash'

import { SectionHeader } from '../../../components'
import { transformContactConsents } from './transformers'

const ConsentDetails = ({ contact }) => {
  const consentGiven = transformContactConsents(contact)
  return (
    <div>
      <SectionHeader type="contact-consent">Contact consent</SectionHeader>
      {isNil(contact.consentData) ? (
        <p data-test="no-contact-consents">
          There is no consent data available for this contact
        </p>
      ) : (
        <p>
          {`This contact has ${consentGiven ? 'given' : 'not given'} consent to be contacted.`}
        </p>
      )}
    </div>
  )
}

export default ConsentDetails
