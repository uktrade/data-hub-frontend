import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'

import Sort from '../Sort'

const RoutedSelect = ({ qsParamName, ...props }) => (
  <Route>
    {({ location, history }) => {
      const qsParams = qs.parse(location.search.slice(1))
      return (
        <Sort
          {...props}
          input={{ defaultValue: qsParams[qsParamName] }}
          onChange={(e) =>
            history.push({
              search: qs.stringify({
                ...qsParams,
                [qsParamName]: e.target.value,
              }),
            })
          }
        />
      )
    }}
  </Route>
)

export default RoutedSelect
