import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { H2 } from 'govuk-react'

import { DefaultLayout, Form, FormLayout } from '../../../components'
import { CompanyResource, FileResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'

import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_DELETE_FILE } from './state'
import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../CollectionList/constants'
import { RED } from '../../../utils/colours'

const documentTypeText = {
  sharePoint: 'Delete SharePoint link',
  uploadable: 'Delete uploaded file',
}

const CompanyName = ({ id }) => (
  <CompanyResource.Inline id={id}>
    {(company) => company.name}
  </CompanyResource.Inline>
)

const SharePointForm = ({ file }) => {
  return (
    <Form
      id="delete-sharepoint-link-form"
      submissionTaskName={TASK_DELETE_FILE}
      analyticsFormName="deleteSharePointLink"
      redirectTo={() => urls.companies.files.index(file?.relatedObjectId)}
      flashMessage={() => 'SharePoint link successfully deleted'}
      submitButtonLabel={documentTypeText.sharePoint}
      cancelButtonLabel="Cancel"
      submitButtonColour={RED}
      cancelRedirectTo={() => urls.companies.files.index(file?.relatedObjectId)}
      transformPayload={() => file?.id}
    >
      <H2>
        Are you sure you want to permanently delete this SharePoint link?{' '}
      </H2>
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

const UploadableFileForm = ({ file }) => {
  return (
    <Form
      id="delete-file-form"
      submissionTaskName={TASK_DELETE_FILE}
      analyticsFormName="deleteFile"
      redirectTo={() => urls.companies.files.index(file?.relatedObjectId)}
      flashMessage={() => 'File successfully deleted'}
      submitButtonLabel={documentTypeText.uploadable}
      cancelButtonLabel="Cancel"
      submitButtonColour={RED}
      cancelRedirectTo={() => urls.companies.files.index(file?.relatedObjectId)}
      transformPayload={() => file?.id}
    >
      <H2>Are you sure you want to permanently delete this file?</H2>
      <p>{file.document.title ? ` ${file.document.originalFilename}` : ''}</p>
      <p>
        This will permanently remove the file for all Data Hub users. This can
        not be undone.
      </p>
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
    pageTitle =
      // TODO: fix company name ref in page title
      documentType === DOCUMENT_TYPES.SHAREPOINT.type
        ? `${documentTypeText.sharePoint} - Files - ${(<CompanyName id={relatedObjectId} />)} - Companies`
        : `${documentTypeText.uploadable} - Files - ${(<CompanyName id={relatedObjectId} />)} - Companies`
    heading =
      documentType === DOCUMENT_TYPES.SHAREPOINT.type
        ? documentTypeText.sharePoint
        : documentTypeText.uploadable
    breadcrumbs.push(
      { link: urls.companies.index(), text: 'Companies' },
      {
        link: urls.companies.detail(relatedObjectId),
        text: <CompanyName id={relatedObjectId} />,
      },
      {
        link: urls.companies.files.index(relatedObjectId),
        text: 'Files',
      },
      {
        text:
          documentType === DOCUMENT_TYPES.SHAREPOINT.type
            ? documentTypeText.sharePoint
            : documentTypeText.uploadable,
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
        {documentType === DOCUMENT_TYPES.SHAREPOINT.type ? (
          <FileResource id={fileId}>
            {(file) => <SharePointForm file={file} />}
          </FileResource>
        ) : (
          <FileResource id={fileId}>
            {(file) => <UploadableFileForm file={file} />}
          </FileResource>
        )}
      </FormLayout>
    </DefaultLayout>
  )
}

export default DeleteFile
