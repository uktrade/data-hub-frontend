import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BLACK, GREY_3 } from 'govuk-colours'
import { Search } from '@govuk-react/icons'
import Select from '@govuk-react/select'
import { isEmpty } from 'lodash'
import Button from '@govuk-react/button'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import FormGroup from '@govuk-react/form-group'
import styled from 'styled-components'

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

const UNITED_KINGDOM_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const UNITED_STATES_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'

const StyledFieldPostcode = styled(FieldInput)`
  ${MEDIA_QUERIES.TABLET} {
    max-width: 200px;
  }
`

const FieldAddress = ({
  label,
  legend,
  hint,
  name,
  country,
  apiEndpoint,
  onSelectUKAddress,
  features,
  isCountrySelectable,
}) => {
  const areaFieldEnabled = features && features.areaFormField
  const postcodeValidationEnabled = features && features.postcodeValidation
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
    setIsUK(country_form_value === UNITED_KINGDOM_ID)
    setIsUS(country_form_value === UNITED_STATES_ID)
    setIsCanada(country_form_value === CANADA_ID)
  }, [country_form_value, isUK, isUS, isCanada])

  useEffect(() => {
    if (areaFieldEnabled) {
      onAdministrativeAreaSearch()
    }
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
    setFieldValue('country', isCountrySelectable ? address.country : country.id)
    setFieldValue('area', address.area)
    setFieldValue('country', country.id)

    if (onSelectUKAddress) {
      onSelectUKAddress(address)
    }
  }

  const renderUsStateField = () => {
    if (isUS && usStates?.length > 0) {
      return (
        <FieldSelect
          type="text"
          name="area"
          label="State"
          options={usStates}
          required="Select a state"
          emptyOption="-- Select state --"
        />
      )
    }
  }

  const renderCanadaProvinceField = () => {
    if (isCanada && canadaProvinces?.length > 0) {
      return (
        <FieldSelect
          type="text"
          name="area"
          label="Province"
          options={canadaProvinces}
          required="Select a province"
          emptyOption="-- Select province --"
        />
      )
    }
  }

  const postcodeLabel = () => {
    if (isUS) return 'ZIP Code'
    if (isCanada) return 'Postal Code'
    return 'Postcode (optional)'
  }

  const postcodeErrorMessage = () => {
    if (isUS) return 'Enter a ZIP code'
    if (isCanada) return 'Enter a postal code'
  }

  const NonUKPostcodeField = () => {
    return (
      <StyledFieldPostcode
        type="text"
        name="postcode"
        label={
          postcodeValidationEnabled ? postcodeLabel() : 'Postcode (optional)'
        }
        required={postcodeValidationEnabled ? postcodeErrorMessage() : null}
      />
    )
  }

  return (
    <FieldWrapper {...{ label, legend, hint, name }} showBorder={true}>
      {isUK ? (
        <>
          <StyledFieldPostcode
            type="search"
            name="postcode"
            label="Postcode"
            required="Enter a postcode"
            maxLength={10}
          />
          <Button
            onClick={onSearchClick}
            buttonColour={GREY_3}
            buttonTextColour={BLACK}
            icon={<Search />}
            id="postcode-search"
          >
            Find UK address
          </Button>
          {error && (
            <StatusMessage>
              Error occurred while searching for an address. Enter the address
              manually.
            </StatusMessage>
          )}
          {addressList && addressList.length > 0 && (
            <FormGroup>
              <Select label="Select an address" onChange={onAddressSelect}>
                {addressList.map(({ address1 }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <option key={index} value={index}>
                    {address1}
                  </option>
                ))}
              </Select>
            </FormGroup>
          )}
        </>
      ) : (
        NonUKPostcodeField()
      )}

      <FieldInput
        type="text"
        name="address1"
        label="Address line 1"
        required="Enter an address line 1"
      />
      <FieldInput
        type="text"
        name="address2"
        label="Address line 2 (optional)"
      />
      <FieldInput
        type="text"
        name="city"
        label="Town or city"
        required="Enter a town or city"
      />

      <FieldInput type="text" name="county" label="County (optional)" />

      {areaFieldEnabled && (
        <>
          {renderUsStateField()}
          {renderCanadaProvinceField()}
          {administrativeAreaSearchError && (
            <StatusMessage>
              Error occurred while retrieving Administrative Areas.
            </StatusMessage>
          )}
        </>
      )}

      {isCountrySelectable ? (
        <FieldCountrySelect name="country" />
      ) : (
        <FieldUneditable name="country" label="Country">
          {country.name}
        </FieldUneditable>
      )}
    </FieldWrapper>
  )
}

FieldAddress.propTypes = {
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  name: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
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
