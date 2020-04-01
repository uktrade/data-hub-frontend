import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { H4 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'
import ErrorSummary from '@govuk-react/error-summary'
import Paragraph from '@govuk-react/paragraph'

import urls from '../../../../../lib/urls'
import { WEBSITE_REGEX } from '../../add-company/client/constants'

import {
  FormStateful,
  SummaryList,
  FormActions,
  FieldInput,
} from 'data-hub-components'

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
    address: values.address,
    website: values.website,
    telephoneNumber: values.telephoneNumber,
  })
  return urls.companies.detail(values.companyId)
}

function CannotFindMatch({ company, csrfToken }) {
  return (
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
          <H4 as="h2">Contact details of the business for verification</H4>
          <FieldInput
            label="Company's website"
            name="website"
            type="url"
            validate={[requiredWebsiteOrPhoneValidator, websiteValidator]}
          />
          <FieldInput
            label="Company's telephone number"
            hint="If the website of the business does not show the name and address
              of the business as you want it to appear in Data Hub, it is important
              to provide a valid phone number, so the company can be contacted when
              verifying the business details."
            name="telephoneNumber"
            type="tel"
            validate={requiredWebsiteOrPhoneValidator}
          />
          <H4 as="h2">What happens next</H4>
          <Paragraph>
            These business details will be sent to our third party data
            suppliers, so it is important you have consent from the business to
            share these details.
          </Paragraph>
          <Paragraph>
            Our data suppliers might need to contact the company to verify the
            details, so it is important that the website and phone number are
            valid.
          </Paragraph>
          <Paragraph>
            It will NOT change any recorded activity (interactions, OMIS orders
            or Investment projects).
          </Paragraph>
          <FormActions>
            <Button>Send</Button>
            <Link href={urls.companies.match.index(company.id)}>Back</Link>
          </FormActions>
        </>
      )}
    </FormStateful>
  )
}

CannotFindMatch.props = {
  companyId: PropTypes.string.isRequired,
}

export default CannotFindMatch
