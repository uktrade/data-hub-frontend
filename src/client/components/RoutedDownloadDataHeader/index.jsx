import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import PropTypes from 'prop-types'
import { isArray } from 'lodash'

import DownloadDataHeader from '../DownloadDataHeader'

const isBool = (value) => ['true', 'false'].includes(value)

const getQueryStringFromQueryParams = (params) => {
  const transformedParams = {}
  for (const param in params) {
    const field = params[param]
    if (isArray(field) && field.every(isBool)) {
      if (field.length === 1) {
        // Before: field:[true] After: field:true
        transformedParams[param] = field[0] === 'true'
      }
      // If the field.length === 2 such as { field:['false', 'true'] }
      // which is construed as give me everything, exactly the same as
      // not applying a filter: { field:[] }
      // Therefore, we have nothing to set
    } else {
      transformedParams[param] = params[param]
    }
  }

  return qs.stringify(transformedParams)
}

const getDownloadLinkFromLocation = (location, baseDownloadLink) => {
  const { page, ...queryParams } = qs.parse(location.search.slice(1))
  const queryString = getQueryStringFromQueryParams(queryParams)
  return queryString ? `${baseDownloadLink}?${queryString}` : baseDownloadLink
}

const RoutedDownloadDataHeader = ({ baseDownloadLink, ...props }) => {
  return (
    <Route>
      {({ location }) => {
        const downloadLink = getDownloadLinkFromLocation(
          location,
          baseDownloadLink
        )
        return <DownloadDataHeader downloadLink={downloadLink} {...props} />
      }}
    </Route>
  )
}

RoutedDownloadDataHeader.propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  maxItems: PropTypes.number,
  baseDownloadLink: PropTypes.string,
}

export default RoutedDownloadDataHeader
