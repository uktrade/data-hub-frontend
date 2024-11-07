import React from 'react'
import PropTypes from 'prop-types'
import { get, throttle } from 'lodash'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { GridCol, GridRow } from 'govuk-react'

import FieldTypeahead from '../FieldTypeahead'
import { apiProxyAxios } from '../../../Task/utils'
import Highlighter from '../../../Typeahead/Highlighter'
import Tag, { TAG_COLOURS } from '../../../Tag'

const getOptionLabel = (option) =>
  `${option.label}${option.isInList ? ' (in your company lists)' : ''}`

const StyledRow = styled(GridRow)(() => ({
  paddingBottom: `${SPACING.SCALE_2}`,
}))

const CompanyResultWithTags = ({ option, searchString }) => (
  <>
    <StyledRow>
      <GridCol>
        <Highlighter
          optionLabel={getOptionLabel(option)}
          searchStr={searchString}
        />
      </GridCol>
    </StyledRow>
    <GridRow>
      <GridCol>
        <Tag colour={TAG_COLOURS.BLUE} data-test="location-tag">
          {option.ukRegion
            ? `${get(option, 'ukRegion.name')}, UK`
            : get(option, 'address.country.name', 'unknown')}
        </Tag>
      </GridCol>
    </GridRow>
  </>
)

const FieldCompaniesTypeahead = ({
  name,
  label,
  required,
  isMulti,
  onlyShowActiveCompanies = true,
  placeholder = 'Type to search for companies',
  loadOptions,
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder={placeholder}
      noOptionsMessage="Type to search for companies"
      required={required}
      loadOptions={
        loadOptions ??
        throttle(
          (searchString) =>
            apiProxyAxios
              .get('/v4/company', {
                params: {
                  autocomplete: searchString,
                  is_active: onlyShowActiveCompanies,
                },
              })
              .then(({ data: { results } }) =>
                results.map(
                  ({ id, name, is_in_adviser_list, uk_region, address }) => ({
                    label: name,
                    chipLabel: name,
                    value: id,
                    isInList: is_in_adviser_list,
                    ukRegion: uk_region,
                    address,
                  })
                )
              ),
          500
        )
      }
      isMulti={isMulti}
      OptionContent={CompanyResultWithTags}
      {...props}
    />
  )
}

FieldCompaniesTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
  loadOptions: PropTypes.func,
}

export default FieldCompaniesTypeahead
