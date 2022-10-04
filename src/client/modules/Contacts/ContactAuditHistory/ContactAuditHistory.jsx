import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ContactAuditHistoryResource from '../../../components/Resource/ContactAuditHistory'
import { transformResponseToCollection } from './transformers'
import {
  CollectionHeader,
  CollectionList,
  CollectionSort,
  RoutedPagination,
  SectionHeader,
} from '../../../components'
import { state2props } from './state'

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
        <SectionHeader type="audit">Audit history</SectionHeader>
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
