import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { FONT_WEIGHTS } from '@govuk-react/constants'

import { FieldWrapper, Typeahead } from '../../..'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.regular};
  }
`

const getCountryIds = (countries) => ({
  country: countries ? countries.map(({ value }) => value) : [],
})

const FilterCountryTypeahead = ({
  name,
  label = '',
  hint = '',
  isMulti = false,
  placeholder = '',
  closeMenuOnSelect = false,
  selectedCountries = null,
  options = [],
}) => (
  <StyledFieldWrapper label={label} name={name} hint={hint}>
    <Route>
      {({ location, history }) => {
        const qsParams = qs.parse(location.search.slice(1))
        return (
          <Typeahead
            styles={{
              multiValueRemove: () => ({
                display: 'none',
              }),
              clearIndicator: () => ({
                display: 'none',
              }),
            }}
            name={name}
            aria-label={name}
            placeholder={placeholder}
            options={options}
            closeMenuOnSelect={closeMenuOnSelect}
            isMulti={isMulti}
            value={selectedCountries}
            onChange={(countries) => {
              history.push({
                search: qs.stringify({
                  ...qsParams,
                  ...getCountryIds(countries),
                  page: 1,
                }),
              })
            }}
          />
        )
      }}
    </Route>
  </StyledFieldWrapper>
)

FilterCountryTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
}

export default FilterCountryTypeahead
