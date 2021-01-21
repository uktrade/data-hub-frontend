import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import DownloadDataHeader from '../DownloadDataHeader'

const RoutedDownloadDataHeader = ({ baseDownloadLink, ...props }) => {
  return (
    <Route>
      {({ location }) => {
        const { page, ...qsParams } = qs.parse(location.search.slice(1))
        let downloadLink = baseDownloadLink
        if (!isEmpty(qsParams)) {
          downloadLink += `?${qs.stringify({ ...qsParams })}`
        }
        return <DownloadDataHeader downloadLink={downloadLink} {...props} />
      }}
    </Route>
  )
}

RoutedDownloadDataHeader.propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  maxItems: PropTypes.number,
}

export default RoutedDownloadDataHeader
