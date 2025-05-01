import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { H4 } from 'govuk-react'

import {
  DefaultLayout,
  FieldInput,
  Form,
  FormLayout,
} from '../../../components'
import FieldFileUpload from '../../../components/Form/elements/FieldFileUpload'
import { WEBSITE_REGEX } from '../../../../apps/companies/apps/add-company/client/constants'
import { transformFileForApi } from './transformers'
import urls from '../../../../lib/urls'
import { CompanyResource } from '../../../components/Resource'

import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_CREATE_FILE } from './state'
import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../CollectionList/constants'

const CompanyName = ({ id }) => (
  <CompanyResource.Inline id={id}>
    {(company) => company.name}
  </CompanyResource.Inline>
)

const websiteValidator = (value) =>
  value && !WEBSITE_REGEX.test(value)
    ? 'You must enter a valid SharePoint share link'
    : null

const documentTypeText = {
  sharePoint: 'Add a new SharePoint link',
  uploadable: 'Upload a new file',
}

const SharePointForm = ({ relatedObjectId }) => {
  return (
    <Form
      id="add-sharepoint-link-form"
      submissionTaskName={TASK_CREATE_FILE}
      analyticsFormName="addSharePointLink"
      redirectTo={() => urls.companies.files.index(relatedObjectId)}
      flashMessage={() => 'SharePoint link added successfully'}
      submitButtonLabel="Add SharePoint link"
      cancelButtonLabel="Cancel"
      cancelRedirectTo={() => urls.companies.files.index(relatedObjectId)}
      transformPayload={(values) =>
        transformFileForApi({
          relatedObjectId,
          relatedObjectType: RELATED_OBJECT_TYPES.COMPANY,
          documentType: DOCUMENT_TYPES.SHAREPOINT.type,
          values,
        })
      }
    >
      <FieldInput
        label="SharePoint share link url"
        name="url"
        type="url"
        validate={websiteValidator}
        initialValue=""
        required="You must enter a SharePoint share link"
        hint="Paste in the share link from the Sharepoint file."
      />

      <FieldInput
        label="Link title (Optional)"
        name="title"
        type="text"
        initialValue=""
        hint="A short descriptive title to help others identify the file and it's
          use"
      />

      <H4>Access requests</H4>
      <p>
        Access to this file will be handled via SharePoint permissions. People
        who do not have access will need to request file access via SharePoint.
      </p>
    </Form>
  )
}

const UploadableForm = ({ relatedObjectId }) => {
  return (
    <Form
      id="upload-file-form"
      submissionTaskName={TASK_CREATE_FILE}
      analyticsFormName="uploadFile"
      redirectTo={() => urls.companies.files.index(relatedObjectId)}
      flashMessage={() => 'File uploaded successfully'}
      submitButtonLabel="Upload file"
      cancelButtonLabel="Cancel"
      cancelRedirectTo={() => urls.companies.files.index(relatedObjectId)}
      transformPayload={(values) =>
        transformFileForApi({
          relatedObjectId,
          relatedObjectType: RELATED_OBJECT_TYPES.COMPANY,
          documentType: DOCUMENT_TYPES.UPLOADABLE.type,
          values,
        })
      }
    >
      <FieldFileUpload
        name="file"
        required="Choose file"
        label="Chose the file to upload"
      />
      <FieldInput
        label="File title (Optional)"
        name="title"
        type="text"
        initialValue=""
        hint="A short descriptive title to help others identify the file and it's
          use."
      />
    </Form>
  )
}

const CreateFile = () => {
  const [searchParams] = useSearchParams()
  const relatedObjectId = searchParams.get('related_object_id')
  const relatedObjectType = searchParams.get('related_object_type')
  const documentType = searchParams.get('document_type')

  const breadcrumbs = [{ link: '/', text: 'Home' }]
  let pageTitle = null
  let heading = null

  if (relatedObjectType === RELATED_OBJECT_TYPES.COMPANY) {
    pageTitle =
      documentType === DOCUMENT_TYPES.SHAREPOINT.type
        ? `${DOCUMENT_TYPES.SHAREPOINT.label} - Files - ${(<CompanyName id={relatedObjectId} />)} - Companies`
        : `${DOCUMENT_TYPES.UPLOADABLE.label} - Files - ${(<CompanyName id={relatedObjectId} />)} - Companies`
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
          <SharePointForm relatedObjectId={relatedObjectId} />
        ) : (
          <UploadableForm relatedObjectId={relatedObjectId} />
        )}
      </FormLayout>
    </DefaultLayout>
  )
}

export default CreateFile
