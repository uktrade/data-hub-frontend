import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'

import Pagination from '../Pagination'

const RoutedPagination = ({ qsParamName, ...props }) => (
  <Route>
    {({ location, history }) => {
      const { page: activePage = '1', ...qsParams } = qs.parse(
        location.search.slice(1)
      )
      return (
        <Pagination
          {...props}
          activePage={parseInt(activePage, 10)}
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
