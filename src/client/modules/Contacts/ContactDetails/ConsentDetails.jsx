import React from 'react'
import { isNil } from 'lodash'

import { ButtonLink, SecondaryButton, SectionHeader } from '../../../components'
import { transformContactConsents } from './transformers'

const ConsentDetails = ({ contact }) => {
  const consentGiven = transformContactConsents(contact)
  return (
    <>
      <div>
        <SectionHeader type="contact-consent">
          Marketing communications preference
        </SectionHeader>
        {isNil(contact.consentData) ? (
          <p data-test="no-contact-consents">
            There is no marketing communications preferences available for this
            contact
          </p>
        ) : (
          <p>
            {`This contact has opted ${consentGiven ? 'into' : 'out of'} receiving marketing communications.`}
          </p>
        )}
      </div>
      {contact.consentDataManagementUrl && (
        <div data-test="consent-management">
          <p>
            Send a secure link to let them update their own preferences. The
            contact can update their preferences directly through the email
            link.
          </p>
          <div>
            <SecondaryButton
              as={'a'}
              href={`mailto:${contact.email}?subject=Marketing communications preference&body=${contact.consentDataManagementUrl}`}
              data-test="send-consent-email-button"
            >
              Send a link
            </SecondaryButton>
            <ButtonLink
              onClick={() =>
                navigator.clipboard.writeText(contact.consentDataManagementUrl)
              }
              data-test="copy-consent-link-button"
            >
              Copy the link
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  )
}

export default ConsentDetails
