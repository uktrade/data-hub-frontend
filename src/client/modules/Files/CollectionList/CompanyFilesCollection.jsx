import React from 'react'
import { connect } from 'react-redux'
import { Details } from 'govuk-react'
import { useParams } from 'react-router-dom'

import { FILES__LOADED } from '../../../actions'
import { DOCUMENT_TYPES, RELATED_OBJECT_TYPES } from './constants'
import { FilteredCollectionList } from '../../../components'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

import { FILES_LIST_ID, TASK_GET_FILES_LIST, filesState2props } from './state'
import CollectionSummaryCardItem from '../../../components/CollectionList/CollectionSummaryCardItem'
import AccessibleLink from '../../../components/Link'

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
        relatedObjectId: companyId,
      },
      onSuccessDispatch: FILES__LOADED,
    },
  }

  const collectionSummaryCardItemTemplateDefault = (item) => {
    return <CollectionSummaryCardItem {...item} key={item.id} />
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
                Files cannot be added to an archived company.{' '}
                <AccessibleLink href={`/companies/${company.id}/unarchive`}>
                  Click here to unarchive
                </AccessibleLink>
              </Details>
            ) : null}
            <FilteredCollectionList
              {...props}
              collectionName="SharePoint link"
              sortOptions={optionMetadata.sortOptions}
              taskProps={collectionListTask}
              collectionItemTemplate={collectionSummaryCardItemTemplateDefault}
              selectedFilters={selectedFilters}
              addItemButtons={[
                {
                  text: 'Upload file',
                  url: company.archived
                    ? null
                    : `/files/create?related_object_id=${companyId}&related_object_type=${RELATED_OBJECT_TYPES.COMPANY}&document_type=${DOCUMENT_TYPES.UPLOADABLE.type}`,
                },
                {
                  text: 'Add SharePoint link',
                  url: company.archived
                    ? null
                    : `/files/create?related_object_id=${companyId}&related_object_type=${RELATED_OBJECT_TYPES.COMPANY}&document_type=${DOCUMENT_TYPES.SHAREPOINT.type}`,
                },
              ]}
              entityName="file"
              defaultQueryParams={{
                sortby: '-created_on',
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
