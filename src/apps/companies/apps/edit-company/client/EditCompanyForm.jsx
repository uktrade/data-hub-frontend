import React from 'react'
import PropTypes from 'prop-types'
import CompanyMatched from './CompanyMatched'
import CompanyUnmatched from './CompanyUnmatched'
import Form from '../../../../../client/components/Form'
import { UNITED_STATES_ID, CANADA_ID } from '../../../../../common/constants'
import urls from '../../../../../lib/urls'

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
    <Form
      id="edit-company-form"
      submissionTaskName="Edit company"
      analyticsFormName="edit-company-form"
      redirectTo={() => urls.companies.businessDetails(company.id)}
      flashMessage={(result) => {
        if (
          result.company?.duns_number ||
          result.dnbChangeRequest?.company.duns_number
        ) {
          return [
            'Change requested.',
            'Thanks for keeping Data Hub running smoothly.',
          ]
        } else {
          return 'Company record updated'
        }
      }}
      submitButtonLabel="Submit"
      cancelButtonLabel="Return without saving"
      cancelRedirectTo={() => urls.companies.businessDetails(company.id)}
      transformPayload={(values) => ({
        company,
        csrfToken,
        values,
      })}
      initialValues={{
        ...formInitialValues,
        areaUS: areaUS(formInitialValues?.address?.area),
        areaCanada: areaCanada(formInitialValues?.address?.area),
        address: {
          ...formInitialValues.address,
          areaUS: areaUS(formInitialValues?.address?.area),
          areaCanada: areaCanada(formInitialValues?.address?.area),
        },
      }}
    >
      {() => {
        return (
          <>
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
          </>
        )
      }}
    </Form>
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
