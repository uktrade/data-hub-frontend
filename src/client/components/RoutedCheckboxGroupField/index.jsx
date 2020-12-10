import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import qs from 'qs'

import CheckboxGroupField from '../CheckboxGroupField'

const RoutedCheckboxGroupField = ({ qsParam, ...props }) => (
  <Route>
    {({ history, location }) => {
      const qsParams = qs.parse(location.search.slice(1))
      return (
        <CheckboxGroupField
          {...props}
          onChange={(pickedOptions) =>
            history.push({
              search: qs.stringify({
                ...qsParams,
                [qsParam]: pickedOptions.map(({ value }) => value),
                page: 1,
              }),
            })
          }
        />
      )
    }}
  </Route>
)

RoutedCheckboxGroupField.propTypes = {
  name: PropTypes.string.isRequired,
}

export default RoutedCheckboxGroupField
