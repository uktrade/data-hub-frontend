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
          onPageClick={(page) => {
            history.push({
              search: qs.stringify({
                ...qsParams,
                [qsParamName]: page,
              }),
            })
          }}
        />
      )
    }}
  </Route>
)

export default RoutedPagination
