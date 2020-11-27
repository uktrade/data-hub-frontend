import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import { get } from 'lodash'

import Select from '../Select'

const RoutedSelect = ({ qsParamName, ...props }) => (
  <Route>
    {({ location, history }) => {
      const qsParams = qs.parse(location.search.slice(1))
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
