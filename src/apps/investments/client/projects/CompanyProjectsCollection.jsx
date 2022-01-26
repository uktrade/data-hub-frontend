import React from 'react'
import { connect } from 'react-redux'
import { Link, Details } from 'govuk-react'

import { FilteredCollectionList } from '../../../../client/components'
import { listSkeletonPlaceholder } from '../../../../client/components/SkeletonPlaceholder'

import {
  TASK_GET_PROJECTS_LIST,
  COMPANY_PROJECTS_LIST_ID,
  companyProjectsState2props,
} from './state'

import { INVESTMENTS__PROJECTS_LOADED } from '../../../../client/actions'

const CompanyProjectsCollection = ({
  company,
  payload,
  optionMetadata,
  selectedFilters,
  hideAddInvestmentButtonEnabled,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_PROJECTS_LIST,
    id: COMPANY_PROJECTS_LIST_ID,
    progressMessage: 'Loading projects',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        companyId: company.id,
      },
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const isUkCompany = company.uk_based
  return (
    <>
      {company.archived && (
        <Details
          summary="Why can I not add an investment project?"
          data-test="archived-details"
        >
          Investment projects cannot be added to an archived company.{' '}
          <Link href={`/companies/${company.id}/unarchive`}>
            Click here to unarchive
          </Link>
        </Details>
      )}
      <FilteredCollectionList
        {...props}
        collectionName="investment project"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        addItemUrl={
          company.archived || (hideAddInvestmentButtonEnabled && isUkCompany)
            ? null
            : `/investments/projects/create/${company.id}`
        }
        defaultQueryParams={{
          page: 1,
          sortby: 'created_on:desc',
        }}
      />
    </>
  )
}
export default connect(companyProjectsState2props)(CompanyProjectsCollection)
