import React from 'react'
import { H2 } from '@govuk-react/heading'
import styled from 'styled-components'
import pluralize from 'pluralize'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  HEADING_SIZES,
  MEDIA_QUERIES,
} from '@govuk-react/constants'

import { CollectionHeaderRow } from '../../components'
import { decimal } from '../../utils/number-utils'
import AccessibleLink from '../../components/Link'

const ListHeader = styled(H2)({
  marginTop: 0,
  fontWeight: FONT_WEIGHTS.regular,
  fontSize: HEADING_SIZES.MEDIUM,
  marginBottom: 0,
})

const ResultCount = styled('span')({
  fontSize: '36px',
  fontWeight: FONT_WEIGHTS.bold,
  lineHeight: 1,
})

const StyledCollectionHeaderRow = styled(CollectionHeaderRow)({
  alignItems: 'flex-end',
})

const SettingsLink = styled(AccessibleLink)({
  display: 'none',
  fontSize: FONT_SIZE.SIZE_19,
  [MEDIA_QUERIES.TABLET]: {
    display: 'block',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'block',
  },
})

const CollectionHeader = ({ totalItems, pageOrigin, settings = true }) => {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = pluralize('reminders', totalItems)
  const actions = settings ? (
    <SettingsLink
      data-test="reminders-settings-link"
      href={
        pageOrigin
          ? `/reminders/settings?${pageOrigin}=true`
          : '/reminders/settings'
      }
    >
      Settings
    </SettingsLink>
  ) : null
  return (
    <StyledCollectionHeaderRow primary={true} actions={actions}>
      <ListHeader data-test="reminder-list-header">
        <ResultCount>{formattedTotal}</ResultCount>
        {` ${counterSuffix}`}
      </ListHeader>
    </StyledCollectionHeaderRow>
  )
}

export default CollectionHeader
