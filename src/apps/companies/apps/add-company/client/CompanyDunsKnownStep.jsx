import React, { useEffect, useState } from 'react'
import useDnbSearch from '../../../../../client/components/EntityList/useDnbSearch'
import useEntitySearch from '../../../../../client/components/EntityList/useEntitySearch'
import { Step } from '../../../../../client/components'
import { useFormContext } from '../../../../../client/components/Form/hooks'
import ProgressIndicator from '../../../../../client/components/ProgressIndicator'
import { get } from 'lodash'
import { getDnbEntityText } from './CompanySearchStep'
import { ISO_CODE } from './constants'

export const CompanyDunsKnownStep = ({
  dunsNumber,
  csrfToken,
  features,
  countries,
}) => {
  const { setFieldValue, goForward } = useFormContext()
  const apiEndpoint = `/companies/create/dnb/company-search?_csrf=${csrfToken}`
  const { findCompany } = useDnbSearch(apiEndpoint, features)
  const { onEntitySearch, searching, searched, entities } =
    useEntitySearch(findCompany)

  const [alreadyExists, setAlreadyExists] = useState(undefined)

  useEffect(() => onEntitySearch({ duns_number: dunsNumber }), [dunsNumber])
  useEffect(() => {
    if (searched) {
      if (entities.length === 1) {
        const dnb_company = get(entities, '[0].data.dnb_company')
        const datahub_company_id = get(entities, '[0].data.datahub_company.id')

        //if this company is already on datahub don't allow to add
        if (datahub_company_id && dnb_company) {
          setAlreadyExists({ ...dnb_company, company_id: datahub_company_id })
        } else {
          if (dnb_company) {
            const matchingCountry = countries.find(
              ({ value }) => value === dnb_company.address_country
            )
            setFieldValue('dnbCompany', dnb_company)
            if (matchingCountry) {
              if (matchingCountry.value === ISO_CODE.UK) {
                setFieldValue('companyLocation', matchingCountry.value)
              } else {
                setFieldValue('companyLocation', 'overseas')
                setFieldValue('companyOverseasCountry', matchingCountry.value)
              }
            } else {
              setFieldValue('companyLocationUnknown', true)
            }
          } else {
            setFieldValue('cannotFind', true)
          }
          goForward()
        }
      } else {
        setFieldValue('cannotFind', true)
        goForward()
      }
    }
  }, [searched])

  return (
    <Step name="preload-dnb" forwardButton={false} backButton={false}>
      {searching && <ProgressIndicator message="Searching for company" />}
      {searched && alreadyExists && (
        <>
          {getDnbEntityText(
            alreadyExists.company_id,
            alreadyExists.is_out_of_business,
            alreadyExists.primary_name
          )}
        </>
      )}
    </Step>
  )
}
