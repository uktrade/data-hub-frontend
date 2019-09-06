/* eslint-disable */

import React, { useState } from 'react'
import { Details, LoadingBox, H3 } from 'govuk-react'

import { Form, Step, FieldDnbCompany } from 'data-hub-components'

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

        <Step name="companyDetails" forwardButtonText={"Add company"}>
          <p>Add company details</p>

          <Details summary="Why am I seeing this?">
            The company you want to add to Data Hub cannot be found
            in the external databases Data Hub checks.
            You will need to provide information about the company,
            so the company can be added to Data Hub
            while the Data Hub support team checks with the company
            the information you have provided.
          </Details>
        </Step>
      </LoadingBox>
    </Form>
  )
}

AddCompanyForm.propTypes = Form.propTypes
AddCompanyForm.defaultProps = Form.defaultProps

export default AddCompanyForm
