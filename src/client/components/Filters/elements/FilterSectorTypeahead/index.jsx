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

const getSectorIds = (sectors) => ({
  // snake-case as used directly in the query
  sector_descends: sectors ? sectors.map(({ value }) => value) : [],
})

const FilterSectorTypeahead = ({
  name,
  label = '',
  hint = '',
  isMulti = false,
  placeholder = '',
  closeMenuOnSelect = false,
  selectedSectors = null,
  options = {},
}) => (
  <StyledFieldWrapper label={label} name={name} hint={hint}>
    <Route>
      {({ history }) => {
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
            value={selectedSectors}
            onChange={(sectors) => {
              history.push({
                search: qs.stringify({
                  ...qsParams,
                  ...getSectorIds(sectors),
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

FilterSectorTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
}

export default FilterSectorTypeahead
