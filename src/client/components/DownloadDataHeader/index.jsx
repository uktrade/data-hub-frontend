import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button } from 'govuk-react'

import { CollectionHeaderRow } from '../../components'

const StyledLink = styled('a')`
  margin-bottom: 0;
  margin-left: 10px;
`

function DownloadDataHeader({ id = null, count = 0, maxItems = 5000 }) {
  if (!count) {
    return null
  }

  if (count >= maxItems) {
    return (
      <CollectionHeaderRow id={id}>
        Filter to fewer than {maxItems} projects to download
      </CollectionHeaderRow>
    )
  }

  return (
    <Route>
      {({ location }) => {
        const qsParams = qs.parse(location.search.slice(1))
        delete qsParams.page
        const query = qs.stringify({ ...qsParams })
        const searchString = query ? `?${query}` : ''
        const downloadAction = (
          <Button
            key="download"
            as={StyledLink}
            href={`/investments/projects/export${searchString}`}
            download={true}
          >
            Download
          </Button>
        )
        return (
          <CollectionHeaderRow id={id} actions={[downloadAction]}>
            You can now download{' '}
            {count === 1 ? 'this project' : `these ${count} projects`}
          </CollectionHeaderRow>
        )
      }}
    </Route>
  )
}

DownloadDataHeader.propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  maxItems: PropTypes.number,
}

export default DownloadDataHeader
