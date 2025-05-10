import React from 'react'
import { connect } from 'react-redux'
import { Details } from 'govuk-react'
import { useParams } from 'react-router-dom'

import { CONTACTS__LOADED } from '../../../actions'
import { FilteredCollectionList } from '../../../components'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

import {
  TASK_GET_CONTACTS_LIST,
  COMPANY_CONTACTS_LIST_ID,
  companyContactsState2props,
} from './state'
import AccessibleLink from '../../../components/Link'

const getContactLinkText = (item) =>
  item.headingText || 'Contact name not available'

const getContactAriaLabel = (item) => {
  const contactName = item.headingText || 'unknown'
  let companyName = 'unknown'
  let jobTitle = 'unknown'

  if (item.metadata) {
    const companyItem = item.metadata.find((meta) => meta.label === 'Company')
    if (companyItem && companyItem.value != null) {
      companyName = companyItem.value
    }
    const jobTitleItem = item.metadata.find(
      (meta) => meta.label === 'Job title'
    )
    if (jobTitleItem && jobTitleItem.value != null) {
      jobTitle = jobTitleItem.value
    }
  }
  return `Contact ${contactName}. Company ${companyName}. Job title ${jobTitle}.`
}

const CompanyContactsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
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
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Contacts' }]}
            pageTitle="Contacts"
          >
            {company.archived ? (
              <Details
                summary="Why can I not add a contact?"
                data-test="archived-details"
              >
                Contacts cannot be added to an archived company.{' '}
                <AccessibleLink href={`/companies/${company.id}/unarchive`}>
                  Click here to unarchive
                </AccessibleLink>
              </Details>
            ) : null}
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
              getLinkTextForItem={getContactLinkText}
              getAriaLabelForItem={getContactAriaLabel}
            />
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(companyContactsState2props)(CompanyContactsCollection)
