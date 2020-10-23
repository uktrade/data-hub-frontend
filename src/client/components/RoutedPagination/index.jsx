import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'

import Pagination from '../Pagination'

const RoutedPagination = ({ qsParamName, ...props }) => (
  <Route>
    {({ location, history }) => {
      const qsParams = qs.parse(location.search.slice(1))
      return (
        <Pagination
          {...props}
          onClick={(e) => {
            const targetValue = e.target.attributes.getNamedItem(
              'data-page-number'
            ).value
            e.target.blur()
            e.preventDefault()
            history.push({
              search: qs.stringify({
                ...qsParams,
                [qsParamName]: targetValue,
              }),
            })
          }}
        />
      )
    }}
  </Route>
)

export default RoutedPagination
