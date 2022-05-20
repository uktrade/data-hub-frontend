import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { BLACK, GREY_3 } from 'govuk-colours'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'

import ContactResource from '../../../components/Resource/Contact'
import { FieldInput, FieldRadios, SummaryTable } from '../../../components'
import Form from '../../../components/Form'
import urls from '../../../../lib/urls'
import {
  EMAIL_CONSENT_NO,
  EMAIL_CONSENT_YES,
} from '../../../../apps/contacts/constants'
import { ID, TASK_ARCHIVE_CONTACT } from './state'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const getAddress = (contact, companyAddress) => {
  const address = contact.addressSameAsCompany
    ? {
        line1: companyAddress.line_1,
        line2: companyAddress.line_2,
        town: companyAddress.town,
        region: companyAddress.county || null,
        postcode: companyAddress.postcode,
        country: companyAddress.country.name,
      }
    : {
        line1: contact.address1,
        line2: contact.address2,
        town: contact.addressTown,
        region: contact.addressArea
          ? contact.addressArea.name
          : contact.addressCounty,
        postcode: contact.addressPostcode,
        country: contact.addressCountry?.name,
      }
  const addressCleaned = Object.keys(address)
    .filter((key) => address[key] != '' && address[key] != null)
    .reduce((a, key) => ({ ...a, [key]: address[key] }), {})
  return Object.values(addressCleaned).join(', ')
}

const ContactDetails = ({ contactId, companyAddress }) => {
  const [formIsOpen, setFormIsOpen] = useState(false)
  return (
    <ContactResource id={contactId}>
      {(contact) => (
        <>
          <SummaryTable
            caption="Contact details"
            data-test="contact-details-table"
          >
            <SummaryTable.Row heading="Job title" children={contact.jobTitle} />
            {contact.fullTelephoneNumber && (
              <SummaryTable.Row
                heading="Phone number"
                children={contact.fullTelephoneNumber}
              />
            )}
            <SummaryTable.Row
              heading="Address"
              children={getAddress(contact, companyAddress)}
            />
            <SummaryTable.Row heading="Email" children={contact.email} />
            {contact.notes && (
              <SummaryTable.Row
                heading="More details"
                children={contact.notes}
              />
            )}
            <SummaryTable.Row
              heading="Email marketing"
              children={
                contact.acceptsDitEmailMarketing
                  ? EMAIL_CONSENT_YES
                  : EMAIL_CONSENT_NO
              }
            />
          </SummaryTable>
          {!contact.archived && (
            <Button
              as={Link}
              href={urls.contacts.edit(contactId)}
              buttonColour={GREY_3}
              buttonTextColour={BLACK}
            >
              Edit Contact
            </Button>
          )}

          {!contact.archived && (
            <div data-test="archive-contact-container">
              <StyledSectionHeader>Archive contact</StyledSectionHeader>

              <p>Archive this contact if it is no longer required or active.</p>

              {formIsOpen && (
                <Form
                  id={ID}
                  submissionTaskName={TASK_ARCHIVE_CONTACT}
                  submitButtonLabel="Archive"
                  redirectTo={() => urls.contacts.details(contactId)}
                  analyticsFormName="archiveContact"
                  cancelRedirectTo={() => urls.contacts.details(contactId)}
                  transformPayload={(values) => ({
                    values,
                    contactId,
                  })}
                  flashMessage={() => `Contact record updated`}
                >
                  <FieldRadios
                    label="Archive reason"
                    name="archived_reason"
                    required="Select a reason"
                    hint="This contact has:"
                    options={[
                      {
                        label: 'Left the company',
                        value: 'Left the company',
                      },
                      {
                        label: 'Does not want to be contacted',
                        value: 'Does not want to be contacted',
                      },
                      {
                        label: 'Changed role/responsibility',
                        value: 'Changed role/responsibility',
                      },
                      {
                        label: 'Other',
                        value: 'Other',
                        children: (
                          <FieldInput
                            type="text"
                            label="Other"
                            name="archived_reason_other"
                            required="You must enter a reason"
                          />
                        ),
                      },
                    ]}
                  />
                </Form>
              )}
              {!formIsOpen && (
                <Button
                  onClick={() => setFormIsOpen(true)}
                  buttonColour={GREY_3}
                  buttonTextColour={BLACK}
                  data-test="top-level-archive-button"
                >
                  Archive
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </ContactResource>
  )
}

ContactDetails.propTypes = {
  contactId: PropTypes.string.isRequired,
  companyAddress: PropTypes.object.isRequired,
}

export default ContactDetails
