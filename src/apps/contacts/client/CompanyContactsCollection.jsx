import React from 'react'
import { connect } from 'react-redux'
import { Link, Details } from 'govuk-react'

import { CONTACTS__LOADED } from '../../../client/actions'
import { FilteredCollectionList } from '../../../client/components'

import {
  TASK_GET_CONTACTS_LIST,
  COMPANY_CONTACTS_LIST_ID,
  companyContactsState2props,
} from './state'

const CompanyContactsCollection = ({
  company,
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_CONTACTS_LIST,
    id: COMPANY_CONTACTS_LIST_ID,
    progressMessage: 'loading contacts',
    startOnRender: {
      payload: {
        ...payload,
        companyId: company.id,
      },
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  return (
    <>
      {company.archived && (
        <Details
          summary="Why can I not add a contact?"
          data-test="archived-details"
        >
          Contacts cannot be added to an archived company.{' '}
          <Link href={`/companies/${company.id}/unarchive`}>
            Click here to unarchive
          </Link>
        </Details>
      )}
      <FilteredCollectionList
        {...props}
        collectionName="contact"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        addItemUrl={
          company.archived ? null : `/contacts/create?company=${company.id}`
        }
        entityName="contact"
        width="full"
        defaultQueryParams={{
          archived: ['false'],
          sortby: 'modified_on:desc',
          page: 1,
        }}
      ></FilteredCollectionList>
    </>
  )
}

export default connect(companyContactsState2props)(CompanyContactsCollection)
