import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import { get } from 'lodash'

import { getQueryParamsFromLocation } from '../../utils/url'
import Select from '../Select'

const RoutedSelect = ({ qsParamName, ...props }) => (
  <Route>
    {({ location, history }) => {
      const qsParams = getQueryParamsFromLocation(location)
      const initialValue = get(qsParams, qsParamName, '')
      const onChange = (e) => {
        history.push({
          search: qs.stringify({
            ...qsParams,
            [qsParamName]: e.target.value,
          }),
        })
      }
      return <Select {...props} input={{ initialValue, onChange }} />
    }}
  </Route>
)

export default RoutedSelect
