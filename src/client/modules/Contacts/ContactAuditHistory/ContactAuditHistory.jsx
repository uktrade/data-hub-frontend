import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  ContactResource,
  ContactAuditHistoryResource,
} from '../../../components/Resource'
import { transformResponseToCollection } from './transformers'
import {
  CollectionHeader,
  CollectionList,
  CollectionSort,
  RoutedPagination,
  SectionHeader,
} from '../../../components'
import ContactLayout from '../../../components/Layout/ContactLayout'
import { state2props } from './state'

function getTotalPages(totalItems, pageSize) {
  return Math.ceil(totalItems / pageSize)
}

function getOffset(limit, page) {
  return limit * (page - 1)
}

const ContactAuditHistory = ({
  contactId,
  page = 1,
  pageSize = 10,
  permissions,
}) => (
  <ContactResource id={contactId}>
    {(contact) => (
      <ContactAuditHistoryResource
        id={contactId}
        payload={{ limit: pageSize, offset: getOffset(pageSize, page) }}
      >
        {(contactAuditHistory) => (
          <>
            <ContactLayout contact={contact} permissions={permissions}>
              <>
                <SectionHeader type="audit">Audit history</SectionHeader>
                <CollectionHeader
                  totalItems={contactAuditHistory.count}
                  collectionName="result"
                  data-test="audit-results"
                />
                {contactAuditHistory.count > 0 ? (
                  <CollectionSort
                    totalPages={getTotalPages(
                      contactAuditHistory.count,
                      pageSize
                    )}
                  />
                ) : null}

                <CollectionList
                  items={transformResponseToCollection(contactAuditHistory)}
                  count={contactAuditHistory.count}
                  activePage={page}
                  data-test="contact-audit-history-list"
                  onPageClick={() => {}}
                />
                <RoutedPagination
                  initialPage={page}
                  items={contactAuditHistory.count}
                  pageSize={pageSize}
                  totalPages={getTotalPages(contactAuditHistory.count)}
                />
              </>
            </ContactLayout>
          </>
        )}
      </ContactAuditHistoryResource>
    )}
  </ContactResource>
)

ContactAuditHistory.propTypes = {
  contactId: PropTypes.string.isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
}

export default connect(state2props)(ContactAuditHistory)
