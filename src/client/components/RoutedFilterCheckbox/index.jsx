import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '../Checkbox'
import MultiChoice from '@govuk-react/multi-choice'
import { GREY_2, YELLOW } from 'govuk-colours'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import qs from 'qs'
import { get } from 'lodash'

import { FieldWrapper } from '../../components'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: normal;
  }
  label:not(:first-child) {
    padding-left: 20px;
  }
  input {
    left: -10px;
    top: -2px;
    + span {
      padding: 10px 15px 5px;
      &::before {
        top: 8px;
        width: 24px;
        height: 24px;
      }
      &::after {
        top: 14px;
        left: 5px;
        width: 10px;
        height: 4.5px;
        border-width: 0 0 3px 3px;
      }
    }
    &:hover {
      + span {
        &::before {
          outline: 10px solid ${GREY_2};
        }
      }
    }
    &:focus {
      + span {
        &::before {
          box-shadow: 0 0 0 4px ${YELLOW};
        }
      }
    }
  }
`
const RoutedFilterCheckboxes = ({
  name,
  label = '',
  hint = '',
  options = [],
}) => {
  return (
    <StyledFieldWrapper label={label} name={name} hint={hint}>
      <MultiChoice>
        {options.map(
          ({ value: optionValue, label: optionLabel, ...optionProps }) => (
            <Route key={optionValue}>
              {({ history, location }) => {
                const qsParams = qs.parse(location.search.slice(1))
                const currentState = Array.isArray(qsParams[name])
                  ? qsParams[name]
                  : [qsParams[name]]
                const initialOptions = get(qsParams, 'stage', '')
                return (
                  <Checkbox
                    name={name}
                    qsParams={qsParams}
                    initialOptions={initialOptions}
                    value={optionValue}
                    onChange={(event) => {
                      const isChecked = event.target.checked
                      const payload = {
                        ...qsParams,
                        [name]: [...currentState, event.target.value],
                        page: 1,
                      }
                      const removeElement = {
                        ...qsParams,
                        [name]: {
                          ...currentState.filter(
                            (x) => x !== event.target.value
                          ),
                        },
                        page: 1,
                      }
                      history.push({
                        search: qs.stringify(
                          isChecked ? payload : removeElement
                        ),
                      })
                    }}
                    aria-label={optionLabel}
                    {...optionProps}
                  >
                    {optionLabel}
                  </Checkbox>
                )
              }}
            </Route>
          )
        )}
      </MultiChoice>
    </StyledFieldWrapper>
  )
}

RoutedFilterCheckboxes.propTypes = {
  name: PropTypes.string.isRequired,
}

export default RoutedFilterCheckboxes
