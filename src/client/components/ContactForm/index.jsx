/* eslint-disable react-hooks/rules-of-hooks */

import qs from 'qs'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Link from '@govuk-react/link'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import Label from '@govuk-react/label'

import multiInstance from '../../utils/multiinstance'
import { CONTACT_FORM__SUBMIT } from '../../actions'

import Form from '../Form'
import {
  FieldInput,
  FieldRadios,
  FieldTextarea,
  FieldCheckboxes,
  FieldAddress,
  Main,
  FormLayout,
} from '..'
import LocalHeader from '../LocalHeader/LocalHeader'
import { CompanyResource, ContactResource } from '../Resource'
import * as validators from '../Form/validators'
import State from '../State'
import {
  UNITED_STATES_ID,
  CANADA_ID,
  GENERIC_PHONE_NUMBER_REGEX,
  FORM_LAYOUT,
} from '../../../common/constants'

import useAdministrativeAreaLookup from '../AdministrativeAreaSearch/useAdministrativeAreaLookup'
import useAdministrativeAreaSearch from '../AdministrativeAreaSearch/useAdministrativeAreaSearch'
import urls from '../../../lib/urls'

const YES = 'Yes'
const NO = 'No'
const moreDetailsHint = `
Add anything you think is important about the contact, for example, an alternative
phone number or email address.
`

const boolToYesNo = (x) => (x === true ? YES : x === false ? NO : null)

const keysToSnakeCase = (o) => _.mapKeys(o, (v, k) => _.snakeCase(k))

const stripHost = (u) => {
  const url = new URL(u)
  return url.pathname + url.search
}

const appendParamsToUrl = (origin_url, origin_search, id, name) => {
  const url = new URL(origin_url, window.location.origin)
  let inputParams = new URLSearchParams(
    origin_search ? atob(origin_search) : ''
  )

  inputParams.append('new-contact-id', id)
  inputParams.append('new-contact-name', name)

  url.search = inputParams

  return url.pathname + url.search
}

const StyledLabel = styled(Label)`
  padding-bottom: ${SPACING.SCALE_5};
  font-weight: ${FONT_WEIGHTS.bold};
`

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
  dispatch,
  id,
  notes: moreDetails,
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
      return values.area
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
                const { origin_url, origin_search } = qs.parse(
                  router.location.search
                )
                const redirectTo = ({ name, id }) => {
                  return origin_url
                    ? appendParamsToUrl(origin_url, origin_search, id, name)
                    : urls.contacts.details(id)
                }
                return (
                  <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
                    <Form
                      id="add-contact-form"
                      analyticsFormName={update ? 'editContact' : 'addContact'}
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
                        valid_email,
                        moreDetails,
                        ...values
                      }) => ({
                        contactId,
                        values: {
                          ...keysToSnakeCase(values),
                          email,
                          valid_email: true,
                          notes: moreDetails,
                          accepts_dit_email_marketing:
                            acceptsDitEmailMarketing.includes(YES),
                          primary,
                          company,
                          address_same_as_company:
                            addressSameAsCompany.includes(YES),
                          // The API is complaining if we send the address fields when address_same_as_company is true
                          // If answer changes from yes to no, need to clear address fields on object
                          ...(addressSameAsCompany == YES
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
                        flashMessage(
                          update
                            ? 'Contact record updated'
                            : `You have successfully added a new contact ${result.name}`
                        )
                        hardRedirect(redirectTo(result))
                      }}
                      submitButtonLabel={
                        update ? 'Save and return' : 'Add contact'
                      }
                      cancelRedirectTo={() =>
                        referrerUrl ? stripHost(referrerUrl) : '/'
                      }
                      cancelButtonLabel={
                        update ? 'Return without saving' : 'Cancel'
                      }
                      initialValues={{
                        ...props,
                        moreDetails,
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
                            data-test="group-field-last_name"
                          />
                          <FieldInput
                            label="Job title"
                            name="jobTitle"
                            type="text"
                            required="Enter a job title"
                          />
                          <FieldInput
                            label="Email address"
                            name="email"
                            type="email"
                            required="Enter an email address"
                            validate={validators.email}
                          />
                          <FieldInput
                            label="Phone number (optional)"
                            hint="For international numbers include the country code"
                            name="fullTelephoneNumber"
                            type="text"
                            validate={(x) =>
                              !x?.match(GENERIC_PHONE_NUMBER_REGEX) &&
                              'Phone number should consist of numbers'
                            }
                          />
                          <FieldRadios
                            legend="Is this contact’s work address the same as the company address?"
                            name="addressSameAsCompany"
                            required="Select yes if the contact's work address is the same as the company address"
                            options={[
                              { value: YES, label: YES },
                              {
                                value: NO,
                                label: NO,
                                children: (
                                  <fieldset>
                                    <StyledLabel>
                                      What is the contact's work address?
                                    </StyledLabel>
                                    <FieldAddress
                                      name="" // Required, but has no effect
                                      apiEndpoint="/api/postcodelookup"
                                      isCountrySelectable={true}
                                      fontWeights={FONT_WEIGHTS.regular}
                                    />
                                  </fieldset>
                                ),
                              },
                            ]}
                          />
                          <FieldRadios
                            legend="Is this person a primary contact?"
                            name="primary"
                            required="Select yes if this person is the company's primary contact"
                            options={[
                              { value: YES, label: YES },
                              { value: NO, label: NO },
                            ]}
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
                          <FieldTextarea
                            label="More details (optional)"
                            name="moreDetails"
                            hint={moreDetailsHint}
                          />
                        </>
                      )}
                    </Form>
                  </FormLayout>
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
  reducer: (state, { type }) => {
    switch (type) {
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
  fullTelephoneNumber: PropTypes.string,
  email: PropTypes.string,
  acceptsDitEmailMarketing: PropTypes.bool,
  addressSameAsCompany: PropTypes.bool,
  address1: PropTypes.string,
  address2: PropTypes.string,
  addressTown: PropTypes.string,
  addressCounty: PropTypes.string,
  addressPostcode: PropTypes.string,
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
