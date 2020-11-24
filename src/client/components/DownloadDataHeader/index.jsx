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

function DownloadDataHeader({ count = 0, maxItems = 5000 }) {
  if (!count) {
    return null
  }

  if (count >= maxItems) {
    return (
      <CollectionHeaderRow>
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
          <CollectionHeaderRow actions={[downloadAction]}>
            <span>
              You can now download{' '}
              {count === 1 ? 'this project' : `these ${count} projects`}
            </span>
          </CollectionHeaderRow>
        )
      }}
    </Route>
  )
}

DownloadDataHeader.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  count: PropTypes.number,
  maxItems: PropTypes.number,
}

export default DownloadDataHeader
