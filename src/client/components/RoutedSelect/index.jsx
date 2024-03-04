import React from 'react'
import qs from 'qs'
import { get } from 'lodash'
import { useNavigate, useLocation } from 'react-router-dom-v5-compat'

import Select from '../Select'

const RoutedSelect = ({ qsParamName, ...props }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const qsParams = qs.parse(location.search.slice(1))
  const initialValue = get(qsParams, qsParamName, '')

  const onChange = (e) => {
    navigate({
      search: qs.stringify({
        ...qsParams,
        [qsParamName]: e.target.value,
      }),
    })
  }
  return <Select {...props} input={{ initialValue, onChange }} />
}

export default RoutedSelect
