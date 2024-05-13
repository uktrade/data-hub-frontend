import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'

import CheckboxGroupField from '../CheckboxGroupField'

const RoutedCheckboxGroupField = ({ qsParam, ...props }) => {
  // Don't render component if there are no options.

  const qsParams = qs.parse(location.search.slice(1))
  const navigate = useNavigate()
  if (props.options === undefined) {
    return null
  }

  return (
    <CheckboxGroupField
      {...props}
      onChange={(pickedOptions) =>
        navigate({
          search: qs.stringify({
            ...qsParams,
            [qsParam]: pickedOptions.map(({ value }) => value),
            page: 1,
          }),
        })
      }
    />
  )
}

RoutedCheckboxGroupField.propTypes = {
  name: PropTypes.string.isRequired,
}

export default RoutedCheckboxGroupField
