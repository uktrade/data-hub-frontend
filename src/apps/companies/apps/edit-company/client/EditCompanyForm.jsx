import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import urls from '../../../../../lib/urls'
import CompanyMatched from './CompanyMatched'
import CompanyUnmatched from './CompanyUnmatched'
import {
  StatusMessage,
  FormStateful,
  FormActions,
} from '../../../../../client/components'
import { UNITED_STATES_ID, CANADA_ID } from '../../../../../common/constants'

function EditCompanyForm({
  csrfToken,
  company,
  formInitialValues,
  turnoverRanges,
  employeeRanges,
  regions,
  sectors,
  headquarterTypes,
  oneListEmail,
  isOnOneList,
  features,
}) {
  async function onSubmit(values, isPristine) {
    if (isPristine) {
      // The user has not made any changes so redirect
      // back to the Business Details page.
      return urls.companies.businessDetails(company.id)
    }

    values.address = { ...values.address, area: null }
    values.area = null

    if (values?.address?.country?.id === UNITED_STATES_ID) {
      values.address = { ...values.address, area: { id: values.areaUS } }
      values.area = { id: values.areaUS }
    } else if (values?.address?.country?.id === CANADA_ID) {
      values.address = { ...values.address, area: { id: values.areaCanada } }
      values.area = { id: values.areaCanada }
    }

    // The user has made some changes so make an API call
    await axios.post(urls.companies.edit(company.id), values, {
      params: { _csrf: csrfToken },
    })

    return urls.companies.businessDetails(company.id)
  }

  const areaUS = (addressArea) => {
    if (formInitialValues?.address?.country?.id === UNITED_STATES_ID) {
      return addressArea?.id
    }
    return null
  }

  const areaCanada = (addressArea) => {
    if (formInitialValues?.address?.country?.id === CANADA_ID) {
      return addressArea?.id
    }
    return null
  }

  // TODO: Support nested form values to avoid transformation
  return (
    <FormStateful
      onSubmit={onSubmit}
      initialValues={() => {
        return {
          ...formInitialValues,
          areaUS: areaUS(formInitialValues?.address?.area),
          areaCanada: areaCanada(formInitialValues?.address?.area),
          address: {
            ...formInitialValues.address,
            areaUS: areaUS(formInitialValues?.address?.area),
            areaCanada: areaCanada(formInitialValues?.address?.area),
          },
        }
      }}
    >
      {({ submissionError }) => {
        if (submissionError) {
          // eslint-disable-next-line no-console
          console.error(submissionError)
        }

        return (
          <>
            {submissionError && (
              <StatusMessage>
                Company details could not be saved, try again later.{' '}
                {submissionError.message}
              </StatusMessage>
            )}

            {company.duns_number ? (
              <CompanyMatched
                company={company}
                isOnOneList={isOnOneList}
                regions={regions}
                headquarterTypes={headquarterTypes}
                oneListEmail={oneListEmail}
                sectors={sectors}
                features={features}
              />
            ) : (
              <CompanyUnmatched
                company={company}
                isOnOneList={isOnOneList}
                regions={regions}
                employeeRanges={employeeRanges}
                headquarterTypes={headquarterTypes}
                oneListEmail={oneListEmail}
                sectors={sectors}
                turnoverRanges={turnoverRanges}
                features={features}
              />
            )}

            <FormActions>
              <Button>Submit</Button>
              <Link href={urls.companies.businessDetails(company.id)}>
                Return without saving
              </Link>
            </FormActions>
          </>
        )
      }}
    </FormStateful>
  )
}

EditCompanyForm.propTypes = {
  isOnOneList: PropTypes.bool.isRequired,
  csrfToken: PropTypes.string.isRequired,
  company: PropTypes.object.isRequired,
  features: PropTypes.object,
  formInitialValues: PropTypes.object.isRequired,
  turnoverRanges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  employeeRanges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  headquarterTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  oneListEmail: PropTypes.string.isRequired,
}

export default EditCompanyForm
