import React, { useEffect } from 'react'
import Input from '@govuk-react/input'
import PropTypes from 'prop-types'
import qs from 'qs'
import { useSearchParams } from 'react-router-dom'

import multiInstance from '../../utils/multiinstance'
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
  // This is the only way we can reset the value when the query string param is
  // reset from outside this component
  useEffect(() => {
    if (!qsValue && selectedValue) {
      reset()
    }
  }, [selectedValue, qsValue])

  const [searchParams, setSearchParams] = useSearchParams()

  const writeQs = (value) => {
    searchParams.set('name', value)
    setSearchParams(searchParams)
  }

  return (
    <Input
      {...props}
      value={value}
      type={type}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onEnter(e.target.value)
          writeQs(e.target.value)
        }
      }}
      onBlur={(e) => {
        writeQs(e.target.value)
      }}
    />
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
    const qsValue = qs.parse(router.location.search.slice(1))[qsParam]
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
