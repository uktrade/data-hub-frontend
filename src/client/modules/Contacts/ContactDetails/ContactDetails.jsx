import React from 'react'
import Button from '@govuk-react/button'
import { useParams } from 'react-router-dom'

import { BLACK, GREY_3 } from '../../../../client/utils/colours'
import { CompanyResource, ContactResource } from '../../../components/Resource'
import { SummaryTable, ErrorSummary } from '../../../components'
import urls from '../../../../lib/urls'
import {
  LEFT_COMPANY_OPTION,
  NO_CONTACT_OPTION,
  ROLE_CHANGE_OPTION,
} from '../../../../apps/contacts/constants'
import { ID, TASK_ARCHIVE_CONTACT } from './state'
import ArchiveForm from '../../../components/ArchiveForm'
import ContactLayout from '../../../components/Layout/ContactLayout'
import ConsentDetails from './ConsentDetails'

const getAddress = (contact, companyAddress) => {
  if (!companyAddress) {
    return 'Not set'
  }
  const address = contact.addressSameAsCompany
    ? {
        line1: companyAddress.line1,
        line2: companyAddress.line2,
        town: companyAddress.town,
        region: companyAddress.county || null,
        postcode: companyAddress.postcode,
        country: companyAddress.country?.name,
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

const errorMsg = 'The email address has been flagged as invalid'

const ContactDetails = () => {
  const { contactId } = useParams()
  return (
    <ContactLayout contactId={contactId}>
      <ContactResource id={contactId}>
        {(contact) => (
          <CompanyResource id={contact.company.id}>
            {(company) => (
              <>
                {contact.validEmail === false ? (
                  <ErrorSummary
                    heading="Please update the email address"
                    description={errorMsg}
                    errors={[]}
                  />
                ) : null}
                <SummaryTable
                  caption="Contact details"
                  data-test="contact-details-table"
                >
                  <SummaryTable.Row
                    heading="Job title"
                    children={contact.jobTitle}
                  />
                  <SummaryTable.Row
                    hideWhenEmpty={true}
                    heading="Phone number"
                    children={contact.fullTelephoneNumber}
                  />

                  <SummaryTable.Row
                    heading="Address"
                    children={getAddress(contact, company.address)}
                  />

                  <SummaryTable.Row
                    heading="Email"
                    children={contact.email}
                    flag={contact.validEmail === false}
                  />
                  {contact.notes ? (
                    <SummaryTable.Row
                      heading="More details"
                      children={contact.notes}
                    />
                  ) : null}
                </SummaryTable>
                {!contact.archived ? (
                  <Button
                    as={'a'}
                    href={urls.contacts.edit(contactId)}
                    buttonColour={GREY_3}
                    buttonTextColour={BLACK}
                    data-test="edit-contact-button"
                  >
                    Edit Contact
                  </Button>
                ) : null}

                <ConsentDetails contact={contact} />

                <ArchiveForm
                  id={ID}
                  submissionTaskName={TASK_ARCHIVE_CONTACT}
                  type="contact"
                  isArchived={contact.archived}
                  transformPayload={(values) => ({
                    values,
                    contactId,
                  })}
                  flashMessage={() => `Contact record updated`}
                  redirectUrl={urls.contacts.details(contactId)}
                  analyticsFormName="archiveContact"
                  archiveReasons={[
                    {
                      label: LEFT_COMPANY_OPTION,
                      value: LEFT_COMPANY_OPTION,
                    },
                    {
                      label: NO_CONTACT_OPTION,
                      value: NO_CONTACT_OPTION,
                    },
                    {
                      label: ROLE_CHANGE_OPTION,
                      value: ROLE_CHANGE_OPTION,
                    },
                  ]}
                  radioHint="This contact has:"
                />
              </>
            )}
          </CompanyResource>
        )}
      </ContactResource>
    </ContactLayout>
  )
}

export default ContactDetails
