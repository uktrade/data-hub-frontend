import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { FONT_WEIGHTS, LINE_HEIGHT } from '@govuk-react/constants'

import FieldWrapper from '../Form/elements/FieldWrapper'
import Typeahead from '../Typeahead'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.bold};
    line-height: ${LINE_HEIGHT.SIZE_16};
  }
`

const getParamIds = (qsParam, pickedOptions) => ({
  [qsParam]: pickedOptions ? pickedOptions.map(({ value }) => value) : [],
})

const RoutedTypeahead = ({
  name,
  qsParam,
  label,
  hint,
  isMulti,
  placeholder,
  closeMenuOnSelect,
  selectedOptions,
  loadOptions,
  noOptionsMessage,
  options,
  ...props
}) => (
  <Route>
    {({ history, location }) => {
      const qsParams = qs.parse(location.search.slice(1))
      return (
        <StyledFieldWrapper label={label} name={name} hint={hint} {...props}>
          <Typeahead
            name={name}
            aria-label={name}
            placeholder={placeholder}
            initialOptions={options}
            closeMenuOnSelect={closeMenuOnSelect}
            isMulti={isMulti}
            value={selectedOptions.map(({ value, label }) => ({
              value,
              label,
            }))}
            loadOptions={loadOptions}
            noOptionsMessage={noOptionsMessage}
            onChange={(pickedOptions) => {
              history.push({
                search: qs.stringify({
                  ...qsParams,
                  ...getParamIds(qsParam, pickedOptions),
                  page: 1,
                }),
              })
            }}
          />
        </StyledFieldWrapper>
      )
    }}
  </Route>
)

RoutedTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  qsParam: PropTypes.string.isRequired,
}

export default RoutedTypeahead
