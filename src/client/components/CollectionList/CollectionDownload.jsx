import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import CollectionHeaderRow from './CollectionHeaderRow'
import MAX_ITEMS_TO_DOWNLOAD from './constants'

const StyledInnerText = styled('div')`
  width: 100%;
  line-height: 36px;
  ${MEDIA_QUERIES.TABLET} {
    width: 0;
    flex-grow: 1;
  }
`

const StyledButton = styled(Button)`
  margin-bottom: 0;
`

function getInnerText(totalItems, itemName) {
  const itemPlural = pluralize.plural(itemName)
  const itemPluralWithCount = pluralize(itemName, totalItems, true)

  if (totalItems === 0) {
    return `There are no ${itemPlural} to download`
  } else if (totalItems <= MAX_ITEMS_TO_DOWNLOAD) {
    return `You can now download ${itemPluralWithCount}`
  } else {
    return `Filter to fewer than ${MAX_ITEMS_TO_DOWNLOAD} ${itemPlural} to download`
  }
}

function CollectionDownload({ totalItems, itemName, downloadUrl }) {
  if (!downloadUrl) {
    return null
  }

  const canDownload = totalItems > 0 && totalItems <= MAX_ITEMS_TO_DOWNLOAD
  const innerText = getInnerText(totalItems, itemName)
  const actions = canDownload && (
    <StyledButton href={downloadUrl}>Download</StyledButton>
  )

  return (
    <CollectionHeaderRow actions={actions}>
      <StyledInnerText>{innerText}</StyledInnerText>
    </CollectionHeaderRow>
  )
}

CollectionDownload.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string,
}

CollectionDownload.defaultProps = {
  downloadUrl: null,
}

export default CollectionDownload
