import React from 'react'
import { connect } from 'react-redux'
import { Link, Details } from 'govuk-react'
import { useParams } from 'react-router-dom'

import { FILES__LOADED } from '../../../actions'
import { FilteredCollectionList } from '../../../components'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

import { FILES_LIST_ID, TASK_GET_FILES_LIST, filesState2props } from './state'
import CollectionSummaryCardItem from '../../../components/CollectionList/CollectionSummaryCardItem'

const CompanyFilesCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const { companyId } = useParams()

  const collectionListTask = {
    name: TASK_GET_FILES_LIST,
    id: FILES_LIST_ID,
    progressMessage: 'loading files',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        companyId: companyId,
      },
      onSuccessDispatch: FILES__LOADED,
    },
  }

  const collectionSummaryCardItemTemplateDefault = (
    item,
    titleRenderer,
    useReactRouter,
    pushAnalytics
  ) => {
    return (
      <CollectionSummaryCardItem
        {...item}
        key={item.id}
        titleRenderer={titleRenderer}
        useReactRouter={useReactRouter}
        onClick={() => {
          pushAnalytics({
            event: 'filterResultClick',
          })
        }}
      />
    )
  }

  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Files' }]}
            pageTitle="Files"
          >
            {company.archived ? (
              <Details
                summary="Why can I not add a file?"
                data-test="archived-details"
              >
                Contacts files be added to an archived company.{' '}
                <Link href={`/companies/${company.id}/unarchive`}>
                  Click here to unarchive
                </Link>
              </Details>
            ) : null}
            <FilteredCollectionList
              {...props}
              collectionName="SharePoint link"
              sortOptions={optionMetadata.sortOptions}
              taskProps={collectionListTask}
              collectionItemTemplate={collectionSummaryCardItemTemplateDefault}
              selectedFilters={selectedFilters}
              addItemUrl={
                company.archived ? null : `/files/create?company=${company.id}`
              }
              entityName="file"
              defaultQueryParams={{
                sortby: 'created_on:desc',
                page: 1,
              }}
            />
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(filesState2props)(CompanyFilesCollection)
