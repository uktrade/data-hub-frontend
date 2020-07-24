import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { H4 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'
import ErrorSummary from '@govuk-react/error-summary'
import Paragraph from '@govuk-react/paragraph'

import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main, SummaryList } from '../../../../../client/components/'
import urls from '../../../../../lib/urls'
import { WEBSITE_REGEX } from '../../add-company/client/constants'

import { FormStateful, FormActions, FieldInput } from 'data-hub-components'

const requiredWebsiteOrPhoneValidator = (
  value,
  name,
  { values: { website, telephoneNumber } }
) => {
  return !website && !telephoneNumber ? 'Enter a website or phone number' : null
}

const websiteValidator = (value) => {
  WEBSITE_REGEX.test(value) ? null : 'Enter a valid website URL'
}

async function onFormSubmit(values, csrfToken) {
  const url = urls.companies.match.cannotFind(values.companyId)
  await axios.post(url, {
    _csrf: csrfToken,
    website: values.website,
    telephone_number: values.telephoneNumber,
  })
  return urls.companies.detail(values.companyId)
}

function CannotFindMatch({ company, csrfToken }) {
  return (
    <>
      <LocalHeader
        heading="I still can’t find what I’m looking for"
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.companies.index(), text: 'Companies' },
          { link: urls.companies.detail(company.id), text: company.name },
          {
            text: 'Send business details',
          },
        ]}
      >
        <Paragraph>
          Add the company contact details below. It will be sent to our third
          party data supplier for verification.
        </Paragraph>
      </LocalHeader>
      <Main>
        <FormStateful
          initialValues={{
            companyId: company.id,
            address: company.address.join(', '),
          }}
          onSubmit={(values) => onFormSubmit(values, csrfToken)}
        >
          {({ submissionError }) => (
            <>
              {submissionError && (
                <ErrorSummary
                  heading="There was an error submitting these details"
                  description={submissionError.message}
                  errors={[]}
                />
              )}
              <H4 as="h2">Data Hub business details (un-verified)</H4>
              <InsetText>
                <SummaryList
                  rows={[
                    { label: 'Company name', value: company.name },
                    { label: 'Located at', value: company.address.join(', ') },
                  ]}
                />
              </InsetText>
              <H4 as="h2">Company contact information</H4>
              <FieldInput
                label="Website address"
                name="website"
                type="url"
                validate={[requiredWebsiteOrPhoneValidator, websiteValidator]}
              />
              <FieldInput
                label="Phone number"
                hint="If the name or address on the company website is different to what there is in Data Hub, please provide the phone number, so the company can be contacted."
                name="telephoneNumber"
                type="tel"
                validate={requiredWebsiteOrPhoneValidator}
              />
              <H4 as="h2">What happens next</H4>
              <Paragraph>You don’t need to do anything else.</Paragraph>
              <Paragraph>
                Our third-party supplier will verify the company’s business
                details directly, so make sure the details are correct and you
                have consent to share them.
              </Paragraph>
              <Paragraph>
                It will NOT change any recorded activity (interactions, OMIS
                orders or Investment projects).
              </Paragraph>
              <FormActions>
                <Button>Send</Button>
                <Link href={urls.companies.match.index(company.id)}>Back</Link>
              </FormActions>
            </>
          )}
        </FormStateful>
      </Main>
    </>
  )
}

CannotFindMatch.props = {
  companyId: PropTypes.string.isRequired,
}

export default CannotFindMatch
