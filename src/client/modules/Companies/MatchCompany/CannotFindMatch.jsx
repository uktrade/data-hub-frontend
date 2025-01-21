import React from 'react'
import { useParams } from 'react-router-dom'
import { H4 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'
import Paragraph from '@govuk-react/paragraph'

import { SummaryList, FieldInput, DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'
import { WEBSITE_REGEX } from '../../../../apps/companies/apps/add-company/client/constants'
import Form from '../../../components/Form'
import { buildCompanyBreadcrumbs } from '../utils'
import { CompanyResource } from '../../../components/Resource/index'
import { CompanyName } from '../Referrals/SendReferralForm/SendReferralForm'

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

function CannotFindMatch() {
  const { companyId } = useParams()
  return (
    <DefaultLayout
      heading={'I still can’t find what I’m looking for'}
      pageTitle={`Send business details - ${(<CompanyName id={companyId} />)} - Companies`}
      breadcrumbs={buildCompanyBreadcrumbs(
        {
          text: 'Send business details',
        },
        companyId,
        <CompanyName id={companyId} />
      )}
      localHeaderChildren={
        <Paragraph>
          Add the company contact details below. It will be sent to our third
          party data supplier for verification.
        </Paragraph>
      }
    >
      <CompanyResource id={companyId}>
        {(company) => (
          <Form
            id="cannot-find-match-form"
            submissionTaskName="Cannot find match"
            analyticsFormName="cannotFindMatchForm"
            redirectTo={() => urls.companies.detail(companyId)}
            transformPayload={(values) => ({ values, company })}
            flashMessage={() =>
              'Verification request sent for third party review'
            }
            submitButtonLabel="Send"
            cancelRedirectTo={() => urls.companies.match.index(companyId)}
            cancelButtonLabel="Back"
          >
            {() => (
              <>
                <H4 as="h2">Data Hub business details (un-verified)</H4>
                <InsetText>
                  <SummaryList
                    rows={[
                      { label: 'Company name', value: company.name },
                      {
                        label: 'Located at',
                        value: [
                          company.address.line1,
                          company.address.line2,
                          company.address.town,
                          company.address.county,
                          company.address.postcode,
                          company.address?.area?.name,
                          company.address.country?.name,
                        ]
                          .filter(Boolean)
                          .join(', '),
                      },
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
              </>
            )}
          </Form>
        )}
      </CompanyResource>
    </DefaultLayout>
  )
}

export default CannotFindMatch
