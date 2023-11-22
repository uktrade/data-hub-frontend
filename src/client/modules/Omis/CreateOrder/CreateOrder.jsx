import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Details, InsetText, Label, Link, WarningText } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'

import {
  DefaultLayout,
  FieldRadios,
  FieldTypeahead,
  FieldWrapper,
  Form,
  FormLayout,
} from '../../../components'
import urls from '../../../../lib/urls'
import {
  CompanyContactsResource,
  CompanyResource,
  OmisMarketsResource,
  SectorResource,
} from '../../../components/Resource'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { transformArrayIdNameToValueLabel } from '../../../transformers'
import {
  FORM_LAYOUT,
  OPTIONS_YES_NO,
  OPTION_NO,
} from '../../../../common/constants'
import { TASK_CREATE_ORDER } from './state'
import { transformOrderForApi } from './transformers'
import { transformCompanyAddress } from '../transformers'
import { idNamesToValueLabels } from '../../../utils'

const StyledLabel = styled(Label)`
  font-size: 19px;
  font-weight: 700;
`

const StyledInsetText = styled(InsetText)`
  margin-top: ${SPACING.SCALE_3};
`

const CreateOrder = () => {
  const { companyId } = useParams()
  return (
    <DefaultLayout
      pageTitle="Add an OMIS order - Orders (OMIS)"
      heading="Add an OMIS order"
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        { link: urls.omis.index(), text: 'Orders (OMIS)' },
        { text: 'Add an order' },
      ]}
    >
      <CompanyResource id={companyId}>
        {(company) => (
          <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
            <Form
              id="add-order-form"
              submissionTaskName={TASK_CREATE_ORDER}
              analyticsFormName="addOmisOrder"
              redirectTo={({ data }) => urls.omis.order(data.id)}
              flashMessage={() => 'Order added to Data Hub'}
              transformPayload={(values) =>
                transformOrderForApi({ company, values })
              }
            >
              <FieldWrapper>
                <StyledLabel>Company</StyledLabel>
                <StyledInsetText>
                  {company.name}
                  <br />
                  <br />
                  {transformCompanyAddress(company)}
                  <br />
                  <br />
                  <Link
                    href={urls.omis.create.companySelect()}
                    noVisitedState={true}
                  >
                    Change company
                  </Link>
                </StyledInsetText>
              </FieldWrapper>
              <FieldWrapper name="omis-contact">
                <ResourceOptionsField
                  id={company.id}
                  name="contact"
                  label="Contact"
                  required="Select the contact responsible for this order"
                  placeholder="Select a contact"
                  resource={CompanyContactsResource}
                  resultToOptions={({ results }) =>
                    transformArrayIdNameToValueLabel(results)
                  }
                  field={FieldTypeahead}
                />
                <Details
                  summary="Is the contact you are looking for not listed?"
                  data-test="contact-details"
                >
                  If the contact you are looking for is not listed you can{' '}
                  <Link href={urls.contacts.create(company.id)}>
                    add a new contact
                  </Link>
                  .
                </Details>
              </FieldWrapper>

              <FieldWrapper name="omis-market">
                <ResourceOptionsField
                  id={company.id}
                  name="country"
                  label="Country (market) where the service is required"
                  required="Select country where the service is required"
                  placeholder="Select a country"
                  resource={OmisMarketsResource}
                  field={FieldTypeahead}
                  resultToOptions={(result) =>
                    idNamesToValueLabels(
                      result.filter((option) => !option.disabledOn)
                    )
                  }
                />
              </FieldWrapper>

              <FieldWrapper name="omis-sector">
                <InsetText data-test="sector-inset">
                  {company.name}'s primary sector is {company.sector.name}
                </InsetText>
                <FieldRadios
                  name="useCompanySector"
                  label="Do you want to use the company's primary sector (shown above) for this order?"
                  required="Do you want to use the company's primary sector?"
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                    ...(option.value === OPTION_NO && {
                      children: (
                        <ResourceOptionsField
                          name="sector"
                          label="Sector"
                          required="Select a primary sector"
                          placeholder="Select a sector"
                          resource={SectorResource}
                          field={FieldTypeahead}
                        />
                      ),
                    }),
                  }))}
                />

                <StyledLabel>What happens next?</StyledLabel>
                <p>{`Continuing with the order will notify the post manager for the chosen country${
                  company.ukRegion
                    ? ` and the region manager for ${company.ukRegion.name}.`
                    : '.'
                }`}</p>
                <WarningText>
                  You will not be able to edit the company or country after this
                  point.
                </WarningText>
              </FieldWrapper>
            </Form>
          </FormLayout>
        )}
      </CompanyResource>
    </DefaultLayout>
  )
}

export default CreateOrder
