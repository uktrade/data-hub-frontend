/* eslint-disable */

import React, { useState } from 'react'
import { LoadingBox, H2, H3 } from 'govuk-react'
import { Form, Step, FieldDnbCompany } from 'data-hub-components'
import { MEDIA_QUERIES, FONT_SIZE, SPACING } from '@govuk-react/constants'
import { BLUE, GREY_3 } from 'govuk-colours'
import { uniqueId } from 'lodash'
import styled from 'styled-components'

const StyledDLContainer = styled('div')`
  border-top: 2px solid ${GREY_3};
  border-bottom: 2px solid ${GREY_3};
  padding-top: ${SPACING.SCALE_4};
  padding-bottom: ${SPACING.SCALE_4};
  margin-bottom: ${SPACING.SCALE_5};
`

const StyledInnerRow = styled('div')`
  padding: ${SPACING.SCALE_1} 0;

  ${MEDIA_QUERIES.TABLET} {
    display: inline-flex;
  }
`

const StyledH3 = styled('h3')`
  color: ${BLUE};
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: bold;
`

const StyledDL = styled('dl')`
  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    flex-direction: column;
  }
`

const StyledDT = styled('dt')`
  padding-right: ${SPACING.SCALE_4};
  min-width: 105px;
`

const StyledDD = styled('dd')`
  font-weight: bold;
`

function AddCompanyForm(props) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function submitCallback() {
    setIsSubmitting(true)
    await timeout(1000)
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p>Form submitted, thank you.</p>
    )
  }

  function DLRow({ label, description }) {
    return (
      <StyledInnerRow>
        <StyledDT>{ label }</StyledDT>
        <StyledDD>{ description }</StyledDD>
      </StyledInnerRow>      
    )
  }

  function DL({ rows }) {
    return (
      <StyledDL>
        {rows.map(({ label, description }) => (
          <DLRow label={label} description={description} key={uniqueId()} />
        ))}
      </StyledDL>
    )
  }

  return (
    <Form {...props} onSubmit={submitCallback}>
      <LoadingBox loading={isSubmitting}>
        <Step name="companyType">
          <p>Companies</p>
        </Step>

        <Step name="companySearch" hideForwardButton={true}>
          <H3>Find the company</H3>

          <FieldDnbCompany
            apiEndpoint={`//${props.host}/companies/create/dnb/company-search?_csrf=${props.csrfToken}`}
            country="UK"
            name="dnb_company"
          />
        </Step>

        <Step name="companyDetails" forwardButtonText={"Save and continue"}>
          <H2 size="MEDIUM">Add this company to Data Hub</H2>
          <StyledDLContainer>
            <StyledH3>Samsung Venture Investment</StyledH3>
            <DL rows={[
              { label: 'Sector', description: 'Business (and Consumer) services' },
              { label: 'UK region', description: 'LONDON' },
              { label: 'Address', description: 'Samsung HQ, 44 Riverbank House, Great West Road, Brentford, Middlesex' }
            ]}/>
          </StyledDLContainer>
        </Step>
      </LoadingBox>
    </Form>
  )
}

AddCompanyForm.propTypes = Form.propTypes
AddCompanyForm.defaultProps = Form.defaultProps

export default AddCompanyForm
