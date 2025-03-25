import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { H4 } from 'govuk-react'

import { FileResource } from '../../../components/Resource/index'

import { DefaultLayout, Form, FormLayout } from '../../../components'
import urls from '../../../../lib/urls'
import { CompanyResource } from '../../../components/Resource'

import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_DELETE_FILE } from './state'
import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../CollectionList/constants'
import { RED } from '../../../utils/colours'

const CompanyName = ({ id }) => (
  <CompanyResource.Inline id={id}>
    {(company) => company.name}
  </CompanyResource.Inline>
)

const documentTypeText = {
  sharePoint: 'Delete SharePoint link',
}

const SharePointForm = ({ file }) => {
  return (
    <Form
      id="delete-sharepoint-link-form"
      submissionTaskName={TASK_DELETE_FILE}
      analyticsFormName="deleteSharePointLink"
      redirectTo={() => urls.companies.files(file?.relatedObjectId)}
      flashMessage={() => 'SharePoint link successfully deleted'}
      submitButtonLabel="Delete SharePoint link"
      cancelButtonLabel="Cancel"
      submitButtonColour={RED}
      cancelRedirectTo={() => urls.companies.files(file?.relatedObjectId)}
      transformPayload={() => file?.id}
    >
      <H4>
        Are you sure you want to permanently delete this SharePoint link?{' '}
      </H4>
      <p>
        <a className="govuk-link" href={file.document.url}>
          {file.document.url}
        </a>
        {file.document.title ? ` (${file.document.title})` : ''}
      </p>
      <p>
        This will permanently remove the SharePoint link for all Data Hub users.
        This can not be undone.
      </p>
      <p>The file will not be removed from SharePoint.</p>
    </Form>
  )
}

const DeleteFile = () => {
  const { fileId } = useParams()
  const [searchParams] = useSearchParams()
  const relatedObjectId = searchParams.get('related_object_id')
  const relatedObjectType = searchParams.get('related_object_type')
  const documentType = searchParams.get('document_type')

  const breadcrumbs = [{ link: '/', text: 'Home' }]
  let pageTitle = null
  let heading = null

  if (relatedObjectType === RELATED_OBJECT_TYPES.COMPANY) {
    pageTitle = `${DOCUMENT_TYPES.SHAREPOINT.label} - Files - ${(<CompanyName id={relatedObjectId} />)} - Companies`
    heading = `Delete ${DOCUMENT_TYPES.SHAREPOINT.label}`
    breadcrumbs.push(
      { link: urls.companies.index(), text: 'Companies' },
      {
        link: urls.companies.detail(relatedObjectId),
        text: <CompanyName id={relatedObjectId} />,
      },
      {
        link: urls.companies.files(relatedObjectId),
        text: 'Files',
      },
      {
        text:
          documentType === DOCUMENT_TYPES.SHAREPOINT.type
            ? documentTypeText.sharePoint
            : 'Empty',
      }
    )
  }

  return (
    <DefaultLayout
      pageTitle={pageTitle}
      heading={heading}
      breadcrumbs={breadcrumbs}
    >
      <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
        <FileResource id={fileId}>
          {(file) => <SharePointForm file={file} />}
        </FileResource>
      </FormLayout>
    </DefaultLayout>
  )
}

export default DeleteFile
