import qs from 'qs'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import axios from 'axios'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import multiInstance from '../../utils/multiinstance'
import {
  CONTACT_FORM__DUPLICATE_EMAIL,
  CONTACT_FORM__SUBMIT,
} from '../../actions'

import {
  FormStateful,
  FieldInput,
  FieldRadios,
  FormActions,
  FieldTextarea,
  FieldCheckboxes,
  FieldAddress,
  ErrorSummary,
  Main,
} from '..'

import { addMessage } from '../../utils/flash-messages'
import LocalHeader from '../LocalHeader/LocalHeader'
import FlashMessages from '../LocalHeader/FlashMessages'
import ContactResource from '../Resource/Contact'
import CompanyResource from '../Resource/Company'
import ReferrerLink from '../ReferrerLink'
import * as validators from '../Form/validators'
import State from '../State'
import {
  UNITED_STATES_ID,
  CANADA_ID,
  GENERIC_PHONE_NUMBER_REGEX,
} from '../../../common/constants'

import useAdministrativeAreaLookup from '../AdministrativeAreaSearch/useAdministrativeAreaLookup'
import useAdministrativeAreaSearch from '../AdministrativeAreaSearch/useAdministrativeAreaSearch'

const emailAlreadyExists = (email, features) => {
  const contactEndpointVersion = features['address-area-contact-required-field']
    ? 'v4'
    : 'v3'

  return axios
    .get(`/api-proxy/${contactEndpointVersion}/contact`, { params: { email } })
    .then(({ data }) => data.count)
}

const YES = 'Yes'
const NO = 'No'

const duplicateEmailMessage = (email, companyName) =>
  `The email ${email} already exists at ${companyName}. ` +
  `To continue adding this contact select 'Add contact'. ` +
  "To return to the previous screen, select 'Cancel'."

const boolToYesNo = (x) => (x === true ? YES : x === false ? NO : null)

const keysToSnakeCase = (o) => _.mapKeys(o, (v, k) => _.snakeCase(k))

const _ContactForm = ({
  update,
  contactId,
  redirectTo = ({ id }) => `/contacts/${id}/details`,
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
  features,
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
                ? [{ text: props.name }, { text: 'Edit' }]
                : [{ text: `Add contact at ${company.name}` }]),
            ]}
          />

          <Main>
            <FormStateful
              id="add-contact-form"
              showErrorSummary={true}
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
              onSubmit={async ({
                address1,
                address2,
                city,
                county,
                country,
                areaUS,
                areaCanada,
                postcode,
                acceptsDitEmailMarketing,
                addressSameAsCompany,
                primary,
                email,
                ...values
              }) => {
                if (!update && (!duplicateEmail || duplicateEmail !== email)) {
                  if (await emailAlreadyExists(email, features)) {
                    dispatch({
                      type: CONTACT_FORM__DUPLICATE_EMAIL,
                      duplicateEmail: email,
                    })
                    return
                  }
                } else {
                  dispatch({
                    type: CONTACT_FORM__SUBMIT,
                    duplicateEmail: email,
                  })
                }

                let area = null
                if (country === UNITED_STATES_ID) {
                  area = areaUS
                } else if (country === CANADA_ID) {
                  area = areaCanada
                }

                const payload = {
                  ...keysToSnakeCase(values),
                  email,
                  accepts_dit_email_marketing:
                    acceptsDitEmailMarketing.includes(YES),
                  primary,
                  company,
                  address_same_as_company: addressSameAsCompany,
                  // The API is complaining if we send the address fields when address_same_as_company is true
                  ...(addressSameAsCompany !== YES && {
                    address_1: address1 || ' ',
                    address_2: address2,
                    address_town: city || ' ',
                    address_county: county,
                    address_postcode: postcode,
                    address_area: area,
                    address_country: country,
                  }),
                }

                const contactEndpointVersion = features[
                  'address-area-contact-required-field'
                ]
                  ? 'v4'
                  : 'v3'
                const response = await axios({
                  url: update
                    ? `/api-proxy/${contactEndpointVersion}/contact/${contactId}`
                    : `/api-proxy/${contactEndpointVersion}/contact`,
                  method: update ? 'PATCH' : 'POST',
                  data: payload,
                })

                addMessage(
                  'success',
                  update
                    ? 'Contact record updated'
                    : `You have successfully added a new contact ${response.data.name}`
                )

                return redirectTo(response.data)
              }}
            >
              {({ submissionError, values, errors }) => (
                <>
                  {_.isEmpty(errors) || (
                    <ErrorSummary
                      errors={Object.entries(errors).map(
                        ([targetName, text]) => ({
                          targetName,
                          text,
                        })
                      )}
                    />
                  )}
                  {duplicateEmail && (
                    <FlashMessages
                      flashMessages={{
                        info: [
                          duplicateEmailMessage(values.email, company.name),
                        ],
                      }}
                    />
                  )}
                  {submissionError && (
                    <FlashMessages
                      flashMessages={{
                        'error:with-body': [
                          {
                            heading: 'Something went wrong',
                            body:
                              submissionError.message ||
                              submissionError.toString(),
                          },
                        ],
                      }}
                    />
                  )}
                  <FieldInput
                    label="First name"
                    name="firstName"
                    type="text"
                    required="This field may not be null."
                    data-test="group-field-first_name"
                  />
                  <FieldInput
                    label="Last name"
                    name="lastName"
                    type="text"
                    required="This field may not be null."
                  />
                  <FieldInput
                    label="Job title"
                    name="jobTitle"
                    type="text"
                    required="This field may not be null."
                  />
                  <FieldRadios
                    legend="Is this person a primary contact?"
                    name="primary"
                    required="This field is required."
                    options={[
                      { value: YES, label: YES },
                      { value: NO, label: NO },
                    ]}
                  />
                  <FieldInput
                    label="Telephone country code"
                    name="telephoneCountrycode"
                    type="text"
                    required="This field may not be null."
                    validate={(x) =>
                      !x?.match(/^\d{1,4}$/) &&
                      'Country code should consist of one to four numbers'
                    }
                  />
                  <FieldInput
                    label="Telephone number"
                    name="telephoneNumber"
                    type="text"
                    required="This field may not be null."
                    validate={(x) =>
                      !x?.match(GENERIC_PHONE_NUMBER_REGEX) &&
                      'Telephone number should consist of numbers'
                    }
                  />
                  <FieldInput
                    label="Email"
                    name="email"
                    type="email"
                    required="This field may not be null."
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
                          values.acceptsDitEmailMarketing.includes(YES) &&
                          'By checking this box, you confirm that the contact has opted in to email marketing.',
                      },
                    ]}
                  />
                  <FieldRadios
                    legend="Is the contact’s address the same as the company address?"
                    name="addressSameAsCompany"
                    required="This field is required."
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
                              features={{
                                areaFormField: features['contacts-area-field'],
                                postcodeValidation:
                                  features[
                                    'address-postcode-company-required-field'
                                  ],
                              }}
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
                  <FormActions>
                    <Button data-test="submit">
                      {update ? 'Save and return' : 'Add contact'}
                    </Button>
                    <ReferrerLink data-test="return-link">
                      {update ? 'Return without saving' : 'Cancel'}
                    </ReferrerLink>
                  </FormActions>
                </>
              )}
            </FormStateful>
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
  features: PropTypes.shape({
    code: PropTypes.string,
    is_active: PropTypes.string,
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

export const CreateContactForm = ({ companyId, features, id }) => (
  <State>
    {(state) => {
      const { origin_url } = qs.parse(state.router.location.search)
      return (
        <ContactForm
          companyId={companyId}
          id={id}
          features={features}
          redirectTo={
            origin_url &&
            (({ id, name }) => {
              const encoded = qs.stringify({
                'new-contact-name': name,
                'new-contact-id': id,
              })
              return `${origin_url}?${encoded}`
            })
          }
        />
      )
    }}
  </State>
)

CreateContactForm.propTypes = requiredProps

export const UpdateContactForm = ({ contactId, features, id }) => (
  <ContactResource id={contactId}>
    {(contact) => (
      <ContactForm
        {...contact}
        id={id}
        contactId={contact.id}
        update={true}
        companyId={contact.company.id}
        features={features}
      />
    )}
  </ContactResource>
)

UpdateContactForm.propTypes = {
  ...requiredProps,
  contactId: PropTypes.string.isRequired,
}

export default ({ contactId, companyId, features, id }) =>
  contactId ? (
    <UpdateContactForm contactId={contactId} features={features} id={id} />
  ) : (
    <CreateContactForm companyId={companyId} features={features} id={id} />
  )
