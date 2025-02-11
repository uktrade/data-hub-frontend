import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Search } from '@govuk-react/icons'
import Select from '@govuk-react/select'
import { isEmpty } from 'lodash'
import Button from '@govuk-react/button'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import FormGroup from '@govuk-react/form-group'
import styled from 'styled-components'

import { BLACK, GREY_3 } from '../../../../../client/utils/colours'

import { useFormContext } from '../../hooks'
import useAddressSearch from '../../../AddressSearch/useAddressSearch'
import usePostcodeLookup from '../../../AddressSearch/usePostcodeLookup'
import useAdministrativeAreaLookup, {
  filterAreaDataByCountry,
} from '../../../AdministrativeAreaSearch/useAdministrativeAreaLookup'
import useAdministrativeAreaSearch from '../../../AdministrativeAreaSearch/useAdministrativeAreaSearch'
import FieldInput from '../FieldInput'
import FieldUneditable from '../FieldUneditable'
import FieldWrapper from '../FieldWrapper'
import StatusMessage from '../../../StatusMessage'
import { transformObjectToOption } from '../../../../../apps/transformers'
import FieldSelect from '../FieldSelect'
import FieldCountrySelect from '../FieldCountrySelect'
import {
  UNITED_KINGDOM_ID,
  UNITED_STATES_ID,
  CANADA_ID,
} from '../../../../../common/constants'

const StyledFieldPostcode = styled(FieldInput)`
  ${MEDIA_QUERIES.TABLET} {
    max-width: 200px;
  }
`

const SyledDiv = styled('div')`
  padding-bottom: ${SPACING.SCALE_5};
`

const StyledButtonWrapper = styled('div')`
  margin-bottom: -22px;
  margin-left: 10px;
`

const StyledRowDiv = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const ZIP_CODE_LABEL = 'ZIP code'
const POSTAL_CODE_LABEL = 'Postal code'
const POSTCODE_LABEL = 'Postcode'

const FieldAddress = ({
  label,
  legend,
  hint,
  name,
  country,
  apiEndpoint,
  onSelectUKAddress,
  isCountrySelectable,
  hideCountyField = false,
  initialValue = null,
  useStaticPostcodeField = false,
  isPostcodeRequired = false,
  showBorder = true,
  useStaticCountyField = false,
}) => {
  const findAdministrativeAreas = useAdministrativeAreaLookup()
  const {
    onAdministrativeAreaSearch,
    administrativeAreaSearchError,
    administrativeAreaList,
    isAreaFilterSubmitting,
  } = useAdministrativeAreaSearch(findAdministrativeAreas)

  const findAddress = usePostcodeLookup(apiEndpoint)
  const { onAddressSearch, isSubmitting, error, addressList } =
    useAddressSearch(findAddress)

  const {
    values: { postcode, country: country_form_value },
    setFieldValue,
    validateForm,
    setIsLoading,
  } = useFormContext()

  const [usStates, setUsStates] = useState([])
  const [canadaProvinces, setCanadaProvinces] = useState([])

  const [isUK, setIsUK] = useState(country?.id === UNITED_KINGDOM_ID)
  const [isUS, setIsUS] = useState(country?.id === UNITED_STATES_ID)
  const [isCanada, setIsCanada] = useState(country?.id === CANADA_ID)

  useEffect(() => {
    setIsLoading(isSubmitting && isAreaFilterSubmitting)
  }, [isSubmitting, isAreaFilterSubmitting])

  useEffect(() => {
    if (country_form_value && isCountrySelectable) {
      setIsUK(country_form_value === UNITED_KINGDOM_ID)
      setIsUS(country_form_value === UNITED_STATES_ID)
      setIsCanada(country_form_value === CANADA_ID)
    }
  }, [country_form_value])

  useEffect(() => {
    onAdministrativeAreaSearch()
  }, [])

  useEffect(() => {
    if (administrativeAreaList) {
      setUsStates(
        filterAreaDataByCountry(administrativeAreaList, UNITED_STATES_ID).map(
          (states) => transformObjectToOption(states)
        )
      )

      setCanadaProvinces(
        filterAreaDataByCountry(administrativeAreaList, CANADA_ID).map(
          (states) => transformObjectToOption(states)
        )
      )
    }
  }, [administrativeAreaList])

  function onSearchClick(e) {
    e.preventDefault()

    return isEmpty(validateForm(['postcode']))
      ? onAddressSearch(postcode)
      : null
  }

  const onAddressSelect = (evt) => {
    const index = evt.target.selectedIndex
    if (index === 0) {
      return
    }

    const address = addressList[index]
    setFieldValue('postcode', address.postcode)
    setFieldValue('address1', address.address1)
    setFieldValue('address2', address.address2)
    setFieldValue('city', address.city)
    setFieldValue('county', address.county)

    if (onSelectUKAddress) {
      onSelectUKAddress(address)
    }
  }

  const renderUsStateField = (useStaticCountyField) => {
    if (isUS && usStates?.length > 0 && !useStaticCountyField) {
      return (
        <FieldSelect
          type="text"
          name="area"
          label="State"
          options={usStates}
          required="Select a state"
          emptyOption="Select"
        />
      )
    }
  }

  const renderCanadaProvinceField = (useStaticCountyField) => {
    if (isCanada && canadaProvinces?.length > 0 && !useStaticCountyField) {
      return (
        <FieldSelect
          type="text"
          name="areaCanada"
          label="Province"
          options={canadaProvinces}
          required="Select a province"
          emptyOption="Select"
        />
      )
    }
  }

  const buildPostcodeLabel = (isRequired, isUK, label) =>
    isRequired || isUK ? label : `${label} (optional)`

  const postcodeLabel = (isPostcodeRequired) => {
    if (isUS)
      return buildPostcodeLabel(isPostcodeRequired, isUK, ZIP_CODE_LABEL)
    if (isCanada)
      return buildPostcodeLabel(isPostcodeRequired, isUK, POSTAL_CODE_LABEL)
    return buildPostcodeLabel(isPostcodeRequired, isUK, POSTCODE_LABEL)
  }

  const usZipCodeRegex = /^\d{5}(-\d{4})?$/i

  const canadaPostalCodeRegex =
    /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i

  const usZipCodeValidator = (value) => {
    if (!value) {
      return 'Enter a ZIP code'
    } else if (value && !usZipCodeRegex.test(value)) {
      return 'Enter a valid ZIP code'
    }
  }

  const canadaPostalCodeValidator = (value) => {
    if (!value) {
      return 'Enter a Postal code'
    } else if (value && !canadaPostalCodeRegex.test(value)) {
      return 'Enter a valid Postal code'
    }
  }

  const postcodeValidator = (value) => {
    if (isUS) {
      return usZipCodeValidator(value)
    }
    if (isCanada) {
      return canadaPostalCodeValidator(value)
    }
    return null
  }

  const postcodeErrorMessage = (isPostcodeRequired) => {
    if (isUK || isPostcodeRequired) return 'Enter a postcode'
  }

  return (
    <FieldWrapper {...{ label, legend, hint, name }} showBorder={showBorder}>
      {isCountrySelectable ? (
        <SyledDiv>
          <FieldCountrySelect
            name="country"
            required="Select a country"
            initialValue={country?.id}
            onChange={() => {
              setFieldValue('country_form_value', country_form_value)
            }}
          />
        </SyledDiv>
      ) : (
        <FieldUneditable name="country" label="Country">
          {country.name}
        </FieldUneditable>
      )}
      {(country_form_value || !isCountrySelectable) && (
        <>
          {isUK && !useStaticPostcodeField && (
            <>
              <StyledRowDiv>
                <StyledFieldPostcode
                  type="search"
                  name="postcode"
                  label={postcodeLabel(isPostcodeRequired)}
                  required={postcodeErrorMessage(isPostcodeRequired)}
                  maxLength={10}
                  validate={postcodeValidator}
                />
                <StyledButtonWrapper>
                  <Button
                    onClick={onSearchClick}
                    buttonColour={GREY_3}
                    buttonTextColour={BLACK}
                    icon={<Search />}
                    id="postcode-search"
                  >
                    Find UK address
                  </Button>
                </StyledButtonWrapper>
              </StyledRowDiv>
              {error && (
                <StatusMessage>
                  Error occurred while searching for an address. Enter the
                  address manually.
                </StatusMessage>
              )}
              {addressList && addressList.length > 0 && (
                <FormGroup>
                  <Select label="Select an address" onChange={onAddressSelect}>
                    {addressList.map(({ address1 }, index) => (
                      <option key={index} value={index}>
                        {address1}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}
            </>
          )}
          <FieldInput
            type="text"
            name="address1"
            label="Address line 1"
            required="Enter an address"
            initialValue={initialValue?.address1}
          />
          <FieldInput
            type="text"
            name="address2"
            label="Address line 2 (optional)"
            initialValue={initialValue?.address2}
          />
          <FieldInput
            type="text"
            name="city"
            label="Town or city"
            required="Enter a town or city"
            initialValue={initialValue?.town}
          />
          {(!(isUS || isCanada || hideCountyField) || useStaticCountyField) && (
            <FieldInput
              type="text"
              name="county"
              label="County (optional)"
              initialValue={initialValue?.county}
            />
          )}
          <>
            {renderUsStateField(useStaticCountyField)}
            {renderCanadaProvinceField(useStaticCountyField)}
            {administrativeAreaSearchError && (
              <StatusMessage>
                Error occurred while retrieving Administrative Areas.
              </StatusMessage>
            )}
          </>
          {useStaticPostcodeField && (
            <FieldInput
              type="text"
              name="postcode"
              label={postcodeLabel(isPostcodeRequired)}
              required={postcodeErrorMessage(isPostcodeRequired)}
              maxLength={10}
              validate={postcodeValidator}
              initialValue={initialValue?.postcode}
            />
          )}
          {!isUK &&
            country_form_value !== UNITED_KINGDOM_ID &&
            !useStaticPostcodeField && (
              <StyledFieldPostcode
                type="text"
                name="postcode"
                label={postcodeLabel(isPostcodeRequired)}
                required={postcodeErrorMessage(isPostcodeRequired)}
                maxLength={null}
                validate={postcodeValidator}
              />
            )}
        </>
      )}
    </FieldWrapper>
  )
}

FieldAddress.propTypes = {
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  name: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string,
  onSelectUKAddress: PropTypes.func,
  isCountrySelectable: PropTypes.any,
  // Country is only required if isCountrySelectable is falsy, but this can't be
  // expressed with propTypes
  country: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
}

export default FieldAddress
