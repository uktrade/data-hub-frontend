import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import InputField from '@govuk-react/input-field'

import { FieldWrapper } from '..'
import multiInstance from '../../utils/multiinstance'
import {
  ROUTED_INPUT_FIELD__CHANGE,
  ROUTED_INPUT_FIELD__SELECT,
  ROUTED_INPUT_FIELD__RESET,
} from '../../actions'

const RoutedInputField = ({
  name,
  qsParam,
  placeholder,
  onChange,
  onEnter,
  reset,
  qsValue = '',
  value = qsValue,
  selectedValue,
  ...props
}) => {
  // This is the only way we can reset the value when the query string param is
  // reset from outside this component
  useEffect(() => {
    if (!qsValue && selectedValue) {
      reset()
    }
  }, [selectedValue, qsValue])

  return (
    <Route>
      {({ history, location }) => {
        const qsParams = qs.parse(location.search.slice(1))
        const writeQs = () =>
          history.replace({
            search: qs.stringify({
              ...qsParams,
              [qsParam]: value,
            }),
          })

        return (
          <FieldWrapper {...props} name={name}>
            <InputField
              input={{
                placeholder,
                name,
                value,
                onChange: (e) => onChange(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    onEnter(e.target.value)
                    writeQs()
                  }
                },
                onBlur: writeQs,
              }}
            />
          </FieldWrapper>
        )
      }}
    </Route>
  )
}

RoutedInputField.propTypes = {
  name: PropTypes.string.isRequired,
  qsParam: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}

export default multiInstance({
  name: 'RoutedInputField',
  actionPattern: 'ROUTED_INPUT_FIELD__',
  component: RoutedInputField,
  dispatchToProps: (dispatch) => ({
    onChange: (value) =>
      dispatch({
        type: ROUTED_INPUT_FIELD__CHANGE,
        value,
      }),
    onEnter: (selectedValue) =>
      dispatch({
        type: ROUTED_INPUT_FIELD__SELECT,
        selectedValue,
      }),
    reset: () =>
      dispatch({
        type: ROUTED_INPUT_FIELD__RESET,
      }),
  }),
  componentStateToProps: (cs, { router }, { qsParam }) => {
    const qsValue = qs.parse(router.location.search.slice(1))[qsParam]
    return { ...cs, qsValue }
  },
  reducer: (state, { type, value, selectedValue }) => {
    switch (type) {
      case ROUTED_INPUT_FIELD__CHANGE:
        return { ...state, value }
      // The following two cases are only needed for resetting the value when
      // the query string param is removed from outside of this component
      case ROUTED_INPUT_FIELD__SELECT:
        return { ...state, selectedValue }
      case ROUTED_INPUT_FIELD__RESET:
        return {}
      default:
        return state
    }
  },
})
