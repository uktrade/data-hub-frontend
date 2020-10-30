/* eslint-disable no-undef */
/* eslint-disable no-console */
import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@govuk-react/checkbox'
import MultiChoice from '@govuk-react/multi-choice'
import { BODY_SIZES } from '@govuk-react/constants'
import { GREY_2, YELLOW } from 'govuk-colours'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import qs from 'qs'

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

const StyledCheckbox = styled(Checkbox)`
  ${(props) =>
    props.reduced &&
    `
      padding: 8px 0 8px 33px !important;
      min-height: auto;
      margin-bottom: 1px;

      input {
        width: 18px;
        height: 18px;
      }
      input + span {
        padding: 0;
        &:before {
          margin: 8px 0 0 8px;
          height: 18px;
          width: 18px;
          border-width: 1px;
        }
        &:after{
          border-width: 0 0 2px 2px;
          width: 10px;
          height: 5px;
          left: 11px;
        }
      }
      input + span + span {
        padding-left: 0;
        font-size: ${BODY_SIZES.S}px;
      }
    `}
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
                console.log(qsParams[name])
                const currentState = Array.isArray(qsParams[name])
                  ? qsParams[name]
                  : [qsParams[name]]
                return (
                  <StyledCheckbox
                    name={name}
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
                    defaultChecked={
                      (qsParams[name] && optionValue === qsParams[name]) ||
                      (qsParams[name] && qsParams[name].includes(optionValue))
                    }
                    {...optionProps}
                  >
                    {optionLabel}
                  </StyledCheckbox>
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
