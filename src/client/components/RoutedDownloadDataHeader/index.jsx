import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import { Button } from 'govuk-react'
import { SPACING_POINTS } from '@govuk-react/constants'

import { CollectionHeaderRow } from '../../components'

const StyledLink = styled('a')`
  margin-bottom: 0;
  margin-left: ${SPACING_POINTS[2]}px;
`

const RoutedDownloadDataHeader = ({
  id = null,
  count = 0,
  maxItems = 5000,
}) => {
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
        const { page, ...qsParams } = qs.parse(location.search.slice(1))
        let downloadLink = '/investments/projects/export'
        if (!isEmpty(qsParams)) {
          downloadLink += `?${qs.stringify({ ...qsParams })}`
        }

        const downloadAction = (
          <Button
            key="download"
            as={StyledLink}
            href={downloadLink}
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

RoutedDownloadDataHeader.propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  maxItems: PropTypes.number,
}

export default RoutedDownloadDataHeader
