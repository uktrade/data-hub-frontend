import React from 'react'
import qs from 'qs'
import { get } from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'

import DateField from '../DateField'

const RoutedDateField = ({ qsParamName, ...props }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const qsParams = qs.parse(location.search.slice(1))

  return (
    <DateField
      {...props}
      onChange={(e) => {
        navigate({
          search: qs.stringify({
            ...qsParams,
            [qsParamName]: e.target.value,
            page: 1,
          }),
        })
      }}
      initialValue={get(qsParams, qsParamName, '')}
    />
  )
}

export default RoutedDateField
