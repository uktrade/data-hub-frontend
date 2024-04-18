import React, { useEffect } from 'react'
import Input from '@govuk-react/input'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'

import { getQueryParamsFromLocation } from '../../utils/url'
import multiInstance from '../../utils/multiinstance'
import { useTextCaretPosition } from './useTextCaretPosition'
import {
  ROUTED_INPUT__CHANGE,
  ROUTED_INPUT__RESET,
  ROUTED_INPUT__SELECT,
} from '../../actions'

const RoutedInput = ({
  qsParam,
  onChange,
  onEnter,
  reset,
  qsValue = '',
  value = qsValue,
  selectedValue,
  // We destructure these two only to stop React complaining about them
  // being unrecognized input atributes
  dispatch,
  staticContext,
  id,
  type,
  ...props
}) => {
  const { ref, updateTextCaret } = useTextCaretPosition()
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
        const qsParams = getQueryParamsFromLocation(location)
        const writeQs = () =>
          history.replace({
            search: qs.stringify({
              ...qsParams,
              [qsParam]: value,
            }),
          })

        return (
          <Input
            {...props}
            ref={ref}
            value={value}
            type={type}
            onChange={(e) => {
              onChange(e.target.value)
              updateTextCaret()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEnter(e.target.value)
                writeQs()
              }
            }}
            onBlur={writeQs}
          />
        )
      }}
    </Route>
  )
}

RoutedInput.propTypes = {
  qsParam: PropTypes.string.isRequired,
  type: PropTypes.string,
}

export default multiInstance({
  name: 'RoutedInput',
  actionPattern: 'ROUTED_INPUT__',
  component: RoutedInput,
  dispatchToProps: (dispatch) => ({
    onChange: (value) =>
      dispatch({
        type: ROUTED_INPUT__CHANGE,
        value,
      }),
    onEnter: (selectedValue) =>
      dispatch({
        type: ROUTED_INPUT__SELECT,
        selectedValue,
      }),
    reset: () =>
      dispatch({
        type: ROUTED_INPUT__RESET,
      }),
  }),
  componentStateToProps: (cs, { router }, { qsParam }) => {
    const qsValue = getQueryParamsFromLocation(router.location)[qsParam]
    return { ...cs, qsValue }
  },
  reducer: (state, { type, value, selectedValue }) => {
    switch (type) {
      case ROUTED_INPUT__CHANGE:
        return { ...state, value }
      // The following two cases are only needed for resetting the value when
      // the query string param is removed from outside of this component
      case ROUTED_INPUT__SELECT:
        return { ...state, selectedValue }
      case ROUTED_INPUT__RESET:
        return {}
      default:
        return state
    }
  },
})
