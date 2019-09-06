/* eslint-disable */

import React, { useState } from 'react'
import { LoadingBox, H2, H3 } from 'govuk-react'
import { Form, Step, FieldDnbCompany } from 'data-hub-components'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import { BLUE } from 'govuk-colours'
import { uniqueId } from 'lodash'
import styled from 'styled-components'

const StyledDivider = styled('div')`
  border: 1px solid #d8d8dc;
  margin: 18px 0;
`

const StyledDiv = styled('div')`
  padding 5px 0;

  ${MEDIA_QUERIES.TABLET} {
    display: inline-flex;
  }
`

const StyledH3 = styled('h3')`
  color: ${BLUE};
  font-size: 20px;
  font-weight: bold;
`

const StyledDL = styled('dl')`
  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    flex-direction: column;
  }
`

const StyledDT = styled('dt')`
  padding-right: 20px
  width: 105px
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
      <StyledDiv>
        <StyledDT>{ label }</StyledDT>
        <StyledDD>{ description }</StyledDD>
      </StyledDiv>      
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
          <StyledDivider />
          <StyledH3>Samsung Venture Investment</StyledH3>
          <DL rows={[
            { label: 'Sector', description: 'Business (and Consumer) services' },
            { label: 'UK region', description: 'LONDON' },
            { label: 'Address', description: 'Samsung HQ, 44 Riverbank House, Great West Road, Brentford, Middlesex' }
          ]}/>
          <StyledDivider />
        </Step>
      </LoadingBox>
    </Form>
  )
}

AddCompanyForm.propTypes = Form.propTypes
AddCompanyForm.defaultProps = Form.defaultProps

export default AddCompanyForm
