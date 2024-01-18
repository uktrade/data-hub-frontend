import React from 'react'
import { connect } from 'react-redux'
import { Link, Details } from 'govuk-react'
import { useParams } from 'react-router-dom'

import { CONTACTS__LOADED } from '../../../actions'
import { FilteredCollectionList } from '../../../components'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayoutNew from '../../../components/Layout/CompanyLayoutNew'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

import {
  TASK_GET_CONTACTS_LIST,
  COMPANY_CONTACTS_LIST_ID,
  companyContactsState2props,
} from './state'

const CompanyContactsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  returnUrl,
  ...props
}) => {
  const { companyId } = useParams()

  const collectionListTask = {
    name: TASK_GET_CONTACTS_LIST,
    id: COMPANY_CONTACTS_LIST_ID,
    progressMessage: 'loading contacts',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        companyId: companyId,
      },
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayoutNew
            company={company}
            breadcrumbs={[{ text: 'Contacts' }]}
            returnUrl={returnUrl}
            pageTitle="Contacts"
          >
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
                company.archived
                  ? null
                  : `/contacts/create?company=${company.id}`
              }
              entityName="contact"
              defaultQueryParams={{
                archived: ['false'],
                sortby: 'modified_on:desc',
                page: 1,
              }}
            />
          </CompanyLayoutNew>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(companyContactsState2props)(CompanyContactsCollection)
