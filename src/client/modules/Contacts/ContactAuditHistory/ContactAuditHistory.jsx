import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { typography } from '@govuk-react/lib'

import ContactAuditHistoryResource from '../../../components/Resource/ContactAuditHistory'
import { transformResponseToCollection } from './transformers'
import {
  CollectionHeader,
  CollectionList,
  CollectionSort,
  RoutedPagination,
} from '../../../components'
import { state2props } from './state'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

function getTotalPages(totalItems, pageSize) {
  return Math.ceil(totalItems / pageSize)
}

function getOffset(limit, page) {
  return limit * (page - 1)
}

const ContactAuditHistory = ({ contactId, page = 1, pageSize = 10 }) => (
  <ContactAuditHistoryResource
    id={contactId}
    payload={{ limit: pageSize, offset: getOffset(pageSize, page) }}
  >
    {(contactAuditHistory) => (
      <>
        <StyledSectionHeader data-test="audit-heading">
          Audit history
        </StyledSectionHeader>
        <CollectionHeader
          totalItems={contactAuditHistory.count}
          collectionName="result"
          data-test="audit-results"
        />
        {contactAuditHistory.count > 0 && (
          <CollectionSort
            totalPages={getTotalPages(contactAuditHistory.count, pageSize)}
          />
        )}

        <CollectionList
          items={transformResponseToCollection(contactAuditHistory)}
          count={contactAuditHistory.count}
          activePage={page}
          data-test="contact-audit-history-list"
        />
        <RoutedPagination
          initialPage={page}
          items={contactAuditHistory.count}
          pageSize={pageSize}
          totalPages={getTotalPages(contactAuditHistory.count)}
        />
      </>
    )}
  </ContactAuditHistoryResource>
)

ContactAuditHistory.propTypes = {
  contactId: PropTypes.string.isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
}

export default connect(state2props)(ContactAuditHistory)
