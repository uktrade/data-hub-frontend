import React from 'react'
import PropTypes from 'prop-types'
import Select from '@govuk-react/select'
import styled from 'styled-components'

import { FieldWrapper } from '../../../../components'
import Task from '../../../../components/Task'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: normal;
  }
`

const FilterSelect = ({
  name,
  label = '',
  taskProps,
  hint = '',
  onChange,
  options = [],
  value = '',
  emptyOption = 'Please select',
  ...rest
}) => {
  return (
    <StyledFieldWrapper label={label} name={name} hint={hint}>
      <Task.Status {...taskProps}>
        {() => (
          <>
            <Select
              name={name}
              onChange={onChange}
              input={{
                id: name,
                name: name,
                defaultValue: value,
                ...rest,
              }}
            >
              {emptyOption && (
                <option key="" value="">
                  {emptyOption}
                </option>
              )}
              {options.map(({ label: optionLabel, value: optionValue }) => (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              ))}
            </Select>
            {options.find((o) => o.value === value)?.children}
          </>
        )}
      </Task.Status>
    </StyledFieldWrapper>
  )
}

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default FilterSelect
