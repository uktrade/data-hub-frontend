/* eslint-disable camelcase */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Details, LoadingBox } from 'govuk-react'
import PropTypes from 'prop-types'
import { FieldInput, FieldRadios, FieldSelect, Step } from 'data-hub-components'
import FieldAddress from 'data-hub-components/dist/forms/elements/FieldAddress'
import isValid from 'uk-postcode-validator'

import { ISO_CODE, WEBSITE_REGEX } from './constants'
import InformationList from './InformationList'
import { ID, TASK_POSTCODE_TO_REGION } from './state'
import { ADD_COMPANY__REGION_LOADED } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task/index.jsx'

const requiredWebsiteAndOrPhoneValidator = (
  value,
  name,
  { values: { website, telephone_number } }
) => {
  if (!telephone_number && !website) {
    return 'Enter a website or phone number'
  }

  if (telephone_number && !website) {
    return null
  }

  // TODO: Move this validation to the component library
  return !WEBSITE_REGEX.test(website) ? 'Enter a valid website URL' : null
}

function CompanyNotFoundStep({
  organisationTypes,
  regions,
  region,
  sectors,
  country,
  postcode,
}) {
  return (
    <Task>
      {(getTask) => {
        const regionTask = getTask(TASK_POSTCODE_TO_REGION, ID)

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          // check if valid postcode so that the regionTask is not fired on every keystroke and only when the user enters the full postcode
          if (isValid(String(postcode))) {
            regionTask.start({
              payload: postcode,
              onSuccessDispatch: ADD_COMPANY__REGION_LOADED,
            })
          }
        }, [postcode])

        return (
          <Step name="unhappy" forwardButton="Add company">
            <Details summary="Why am I seeing this?">
              The company you want to add to Data Hub cannot be found in the
              external databases Data Hub checks. You will need to provide
              information about the company, so the company can be added to Data
              Hub while the Data Hub support team checks with the company the
              information you have provided.
            </Details>

            <FieldRadios
              name="business_type"
              label="Organisation type"
              required="Select organisation type"
              options={organisationTypes}
            />

            <FieldInput
              label="Name of company"
              name="name"
              required="Enter name"
              type="text"
            />

            <FieldInput
              label="Company's website"
              name="website"
              type="url"
              validate={requiredWebsiteAndOrPhoneValidator}
            />

            <FieldInput
              label="Company's telephone number"
              name="telephone_number"
              type="tel"
              validate={requiredWebsiteAndOrPhoneValidator}
            />

            <FieldAddress
              country={{
                id: country.key,
                name: country.label,
              }}
              apiEndpoint="/api/postcodelookup"
            />

            {country.value === ISO_CODE.UK && (
              <LoadingBox loading={regionTask.progress}>
                <FieldSelect
                  key={region?.value}
                  name="uk_region"
                  label="DIT region"
                  initialValue={region?.value}
                  emptyOption="-- Select DIT region --"
                  options={regions}
                  required="Select DIT region"
                />
              </LoadingBox>
            )}

            <FieldSelect
              name="sector"
              label="DIT sector"
              emptyOption="-- Select DIT sector --"
              options={sectors}
              required="Select DIT sector"
            />

            <InformationList
              heading="What happens next"
              description="You are requesting that a new company be added to Data Hub. Once you select the ‘Add company’ button below:"
            >
              <InformationList.Item>
                you can continue to record interactions with the company
              </InformationList.Item>
              <InformationList.Item>
                Data Hub’s external data provider will confirm with the company
                that the information on this page is correct
              </InformationList.Item>
              <InformationList.Item>
                within 3 weeks the Data Hub support team will send you an email
                to tell you whether the information on this page has been
                confirmed
              </InformationList.Item>
            </InformationList>
          </Step>
        )
      }}
    </Task>
  )
}

CompanyNotFoundStep.propTypes = {
  organisationTypes: PropTypes.arrayOf(
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
  country: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

export default connect(
  ({ addCompany }, { regions, sectors, isUK, postcode }) => {
    const { region } = addCompany
    return {
      regions,
      region,
      sectors,
      isUK,
      postcode,
    }
  }
)(CompanyNotFoundStep)
