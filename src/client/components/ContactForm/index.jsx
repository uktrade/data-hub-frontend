import qs from 'qs'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Link from '@govuk-react/link'

import multiInstance from '../../utils/multiinstance'
import {
  CONTACT_FORM__DUPLICATE_EMAIL,
  CONTACT_FORM__SUBMIT,
} from '../../actions'

import TaskForm from '../Task/Form'
import {
  FieldInput,
  FieldRadios,
  FieldTextarea,
  FieldCheckboxes,
  FieldAddress,
  Main,
} from '..'
import LocalHeader from '../LocalHeader/LocalHeader'
import { FlashMessagesStateless } from '../LocalHeader/FlashMessages'
import ContactResource from '../Resource/Contact'
import CompanyResource from '../Resource/Company'
import * as validators from '../Form/validators'
import State from '../State'
import {
  UNITED_STATES_ID,
  CANADA_ID,
  GENERIC_PHONE_NUMBER_REGEX,
} from '../../../common/constants'

import useAdministrativeAreaLookup from '../AdministrativeAreaSearch/useAdministrativeAreaLookup'
import useAdministrativeAreaSearch from '../AdministrativeAreaSearch/useAdministrativeAreaSearch'
import urls from '../../../lib/urls'

const YES = 'Yes'
const NO = 'No'

const duplicateEmailMessage = (email, companyName) =>
  `The email ${email} already exists at ${companyName}. ` +
  `To continue adding this contact select 'Add contact'. ` +
  "To return to the previous screen, select 'Cancel'."

const boolToYesNo = (x) => (x === true ? YES : x === false ? NO : null)

const keysToSnakeCase = (o) => _.mapKeys(o, (v, k) => _.snakeCase(k))

const stripHost = (u) => {
  const url = new URL(u)
  return url.pathname + url.search
}

const _ContactForm = ({
  update,
  contactId,
  // Needed for linking the newly created contact to a company and breadcrumbs
  companyId,
  // We need to convert these to YES / NO strings
  primary,
  addressSameAsCompany,
  acceptsDitEmailMarketing,
  // These need to be renamed, so that they are compatible with the fields of
  // the address sub-form
  addressPostcode: postcode,
  addressTown: city,
  addressCounty: county,
  addressArea,
  addressCountry,
  // State props
  duplicateEmail,
  dispatch,
  id,
  ...props
}) => {
  const findAdministrativeAreas = useAdministrativeAreaLookup()
  const { onAdministrativeAreaSearch } = useAdministrativeAreaSearch(
    findAdministrativeAreas
  )

  useEffect(() => {
    onAdministrativeAreaSearch()
  }, [])

  const areaUS = (addressArea) => {
    if (addressCountry?.id === UNITED_STATES_ID) {
      return addressArea?.id
    }
    return null
  }

  const areaCanada = (addressArea) => {
    if (addressCountry?.id === CANADA_ID) {
      return addressArea?.id
    }
    return null
  }

  const getAreaValue = (values) => {
    if (values.country === UNITED_STATES_ID) {
      return values.areaUS
    } else if (values.country === CANADA_ID) {
      return values.areaCanada
    } else {
      return null
    }
  }
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <>
          <LocalHeader
            superheading={
              update && (
                <Link href={`/companies/${company.id}`}>{company.name}</Link>
              )
            }
            heading={`${update ? 'Edit' : 'Add'} contact`}
            breadcrumbs={[
              { link: '/', text: 'Home' },
              { link: '/contacts/', text: 'Contacts' },
              ...(update
                ? [
                    {
                      link: urls.contacts.details(contactId),
                      text: props.name,
                    },
                    { text: 'Edit' },
                  ]
                : [{ text: `Add contact at ${company.name}` }]),
            ]}
          />

          <Main>
            <State>
              {({ referrerUrl, router }) => {
                const { origin_url } = qs.parse(router.location.search)
                const redirectTo = ({ name, id }) => {
                  const encoded = qs.stringify({
                    'new-contact-name': name,
                    'new-contact-id': id,
                  })
                  return origin_url
                    ? `${origin_url}?${encoded}`
                    : urls.contacts.details(id)
                }
                return (
                  <TaskForm
                    id="add-contact-form"
                    analyticsFormName={update ? 'edit_contact' : 'add_contact'}
                    submissionTaskName="Save contact"
                    transformPayload={({
                      address1,
                      address2,
                      city,
                      county,
                      postcode,
                      acceptsDitEmailMarketing,
                      addressSameAsCompany,
                      primary,
                      email,
                      ...values
                    }) => ({
                      contactId,
                      duplicateEmail,
                      values: {
                        ...keysToSnakeCase(values),
                        email,
                        accepts_dit_email_marketing:
                          acceptsDitEmailMarketing.includes(YES),
                        primary,
                        company,
                        address_same_as_company:
                          addressSameAsCompany.includes(YES),
                        // The API is complaining if we send the address fields when address_same_as_company is true
                        // If answer changes from yes to no, need to clear address fields on object
                        ...(values.addressSameAsCompany == YES
                          ? {
                              address_1: null,
                              address_2: null,
                              address_town: null,
                              address_county: null,
                              address_postcode: null,
                              address_area: null,
                              address_country: null,
                            }
                          : {
                              address_1: address1 || ' ',
                              address_2: address2,
                              address_town: city || ' ',
                              address_county: county,
                              address_postcode: postcode,
                              address_area: getAreaValue(values),
                              address_country: values.country,
                            }),
                      },
                    })}
                    onSuccess={(
                      result,
                      values,
                      { hardRedirect, flashMessage }
                    ) => {
                      if (typeof result === 'string') {
                        dispatch({
                          type: CONTACT_FORM__DUPLICATE_EMAIL,
                          duplicateEmail: result,
                        })
                      } else {
                        flashMessage(
                          update
                            ? 'Contact record updated'
                            : `You have successfully added a new contact ${result.name}`
                        )
                        hardRedirect(redirectTo(result))
                      }
                    }}
                    submitButtonLabel={
                      update ? 'Save and return' : 'Add contact'
                    }
                    actionLinks={[
                      {
                        href: referrerUrl ? stripHost(referrerUrl) : '/',
                        children: update ? 'Return without saving' : 'Cancel',
                      },
                    ]}
                    initialValues={{
                      ...props,
                      postcode,
                      county,
                      city,
                      area: addressArea?.id,
                      areaUS: areaUS(addressArea),
                      areaCanada: areaCanada(addressArea),
                      country: addressCountry?.id,
                      primary: boolToYesNo(primary),
                      addressSameAsCompany: boolToYesNo(addressSameAsCompany),
                      acceptsDitEmailMarketing: [
                        boolToYesNo(acceptsDitEmailMarketing),
                      ].filter(Boolean),
                    }}
                  >
                    {({ values }) => (
                      <>
                        {duplicateEmail && (
                          <FlashMessagesStateless
                            flashMessages={{
                              info: [
                                duplicateEmailMessage(
                                  values.email,
                                  company.name
                                ),
                              ],
                            }}
                          />
                        )}
                        <FieldInput
                          label="First name"
                          name="firstName"
                          type="text"
                          required="Enter a first name"
                          data-test="group-field-first_name"
                        />
                        <FieldInput
                          label="Last name"
                          name="lastName"
                          type="text"
                          required="Enter a last name"
                        />
                        <FieldInput
                          label="Job title"
                          name="jobTitle"
                          type="text"
                          required="Enter a job title"
                        />
                        <FieldRadios
                          legend="Is this person a primary contact?"
                          name="primary"
                          required="Select yes if this person is a primary contact"
                          options={[
                            { value: YES, label: YES },
                            { value: NO, label: NO },
                          ]}
                        />
                        <FieldInput
                          label="Telephone country code"
                          name="telephoneCountrycode"
                          type="text"
                          required="Enter a telephone country code"
                          validate={(x) =>
                            !x?.match(/^\d{1,4}$/) &&
                            'Country code should consist of one to four numbers'
                          }
                        />
                        <FieldInput
                          label="Telephone number"
                          name="telephoneNumber"
                          type="text"
                          required="Enter a telephone number"
                          validate={(x) =>
                            !x?.match(GENERIC_PHONE_NUMBER_REGEX) &&
                            'Telephone number should consist of numbers'
                          }
                        />
                        <FieldInput
                          label="Email"
                          name="email"
                          type="email"
                          required="Enter an email"
                          validate={validators.email}
                        />
                        <FieldCheckboxes
                          name="acceptsDitEmailMarketing"
                          options={[
                            {
                              value: YES,
                              label:
                                'The company contact does accept email marketing',
                              hint:
                                values?.acceptsDitEmailMarketing?.includes(
                                  YES
                                ) &&
                                'By checking this box, you confirm that the contact has opted in to email marketing.',
                            },
                          ]}
                        />
                        <FieldRadios
                          legend="Is the contact’s address the same as the company address?"
                          name="addressSameAsCompany"
                          required="Select yes if the contact's address is the same as the company address"
                          options={[
                            { value: YES, label: YES },
                            {
                              value: NO,
                              label: NO,
                              children: (
                                <fieldset>
                                  <legend>Contact address</legend>
                                  <FieldAddress
                                    name="" // Required, but has no effect
                                    apiEndpoint="/api/postcodelookup"
                                    isCountrySelectable={true}
                                  />
                                </fieldset>
                              ),
                            },
                          ]}
                        />
                        <FieldInput
                          label="Alternative telephone number (optional)"
                          name="telephoneAlternative"
                          type="text"
                        />
                        <FieldInput
                          label="Alternative email (optional)"
                          name="emailAlternative"
                          type="email"
                          validate={(x) => x && validators.email(x)}
                        />
                        <FieldTextarea label="Notes (optional)" name="notes" />
                      </>
                    )}
                  </TaskForm>
                )
              }}
            </State>
          </Main>
        </>
      )}
    </CompanyResource>
  )
}

export const ContactForm = multiInstance({
  name: 'ContactForm',
  actionPattern: 'CONTACT_FORM__',
  reducer: (state, { type, duplicateEmail }) => {
    switch (type) {
      case CONTACT_FORM__DUPLICATE_EMAIL:
        return { duplicateEmail }
      case CONTACT_FORM__SUBMIT:
        return {}
      default:
        return state
    }
  },
  component: _ContactForm,
})

const requiredProps = {
  update: PropTypes.any,
  company: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
}

ContactForm.propTypes = {
  ...requiredProps,
  contactId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  jobTitle: PropTypes.string,
  primary: PropTypes.bool,
  telephoneCountrycode: PropTypes.string,
  telephoneNumber: PropTypes.string,
  email: PropTypes.string,
  acceptsDitEmailMarketing: PropTypes.bool,
  addressSameAsCompany: PropTypes.bool,
  address1: PropTypes.string,
  address2: PropTypes.string,
  addressTown: PropTypes.string,
  addressCounty: PropTypes.string,
  addressPostcode: PropTypes.string,
  telephoneAlternative: PropTypes.string,
  emailAlternative: PropTypes.string,
  notes: PropTypes.string,
}

export const CreateContactForm = ({ companyId, id }) => (
  <ContactForm companyId={companyId} id={id} />
)

CreateContactForm.propTypes = requiredProps

export const UpdateContactForm = ({ contactId, id }) => (
  <ContactResource id={contactId}>
    {(contact) => (
      <ContactForm
        {...contact}
        id={id}
        contactId={contact.id}
        update={true}
        companyId={contact.company.id}
      />
    )}
  </ContactResource>
)

UpdateContactForm.propTypes = {
  ...requiredProps,
  contactId: PropTypes.string.isRequired,
}

export default ({ contactId, companyId, id }) =>
  contactId ? (
    <UpdateContactForm contactId={contactId} id={id} />
  ) : (
    <CreateContactForm companyId={companyId} id={id} />
  )
