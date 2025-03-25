import React from 'react'
import { useParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { H4 } from 'govuk-react'

import { FileResource } from '../../../components/Resource/index'


import {
  DefaultLayout,
  FieldInput,
  Form,
  FormLayout,
} from '../../../components'
import { WEBSITE_REGEX } from '../../../../apps/companies/apps/add-company/client/constants'
import { transformFileForApi } from './transformers'
import urls from '../../../../lib/urls'
import { CompanyResource } from '../../../components/Resource'

import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_DELETE_FILE } from './state'
import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../CollectionList/constants'
import { getDocument } from './tasks'

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
  sharePoint: 'Delete SharePoint link',
}

const SharePointForm = ({ file }) => {
  console.log(file)
  return (
    <Form
      id="delete-sharepoint-link-form"
      submissionTaskName={TASK_DELETE_FILE}
      analyticsFormName="deleteSharePointLink"
      redirectTo={() => urls.companies.files(file?.related_object_id)}
      flashMessage={() => 'SharePoint link successfully deleted'}
      submitButtonLabel="Delete SharePoint link"
      cancelButtonLabel="Cancel"
      cancelRedirectTo={() => urls.companies.files(file?.related_object_id)}
      transformPayload={(values) =>
      ({
        values,
        fileId: file?.related_object_id,
      })
      }
    >

      <H4>Are you sure you want to permanently delete this SharePoint link? </H4>
      <p>
        <a href="file">(file.url)</a>
        Are you sure you want to permanently delete this SharePoint link?

        { }
        https://dbis.sharepoint.com/:p:/r/sites/DDaTDataallstaff/_layouts/15/Doc.aspx?
        This will permanently remove the SharePoint link for all Data Hub users. This can not be undone.

        The file will not be removed from SharePoint.
      </p>
    </Form>
  )
}

const DeleteFile = () => {
  const { fileId } = useParams()

  // return (
  //   <DefaultLayout>
  //     <CompanyResource id='008ba003-b528-4e79-b209-49fcfcceb371'>
  //       {(file) => (
  //         // I will be rendered only when the "get something" task resolves
  //         <pre>{JSON.stringify(file)}</pre>
  //       )}
  //     </CompanyResource>
  //     <FileResource id={fileId}>
  //       {(file) => (
  //         // I will be rendered only when the "get something" task resolves
  //         <pre>{JSON.stringify(file)}</pre>
  //       )}

  //       {/* {(file) => (
  //       <DefaultLayout
  //         // pageTitle={pageTitle}
  //         // heading={heading}
  //         // breadcrumbs={breadcrumbs}
  //       >{console.log(file)}
  //         {/* <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
  //           <SharePointForm relatedObjectId={relatedObjectId} />
  //         </FormLayout> */}
  //       {/*</FileResource>        </DefaultLayout>
  //     )} */}
  //     </FileResource>
  //   </DefaultLayout>
  // )

  console.log(fileId)
  // documentInfo = getDocument(fileId)
  // console.log(documentInfo)
  const [searchParams] = useSearchParams()
  const relatedObjectId = searchParams.get('related_object_id')
  const relatedObjectType = searchParams.get('related_object_type')
  const documentType = searchParams.get('document_type')

  const breadcrumbs = [{ link: '/', text: 'Home' }]
  let pageTitle = null
  let heading = null

  if (relatedObjectType === RELATED_OBJECT_TYPES.COMPANY) {
    pageTitle = `${DOCUMENT_TYPES.SHAREPOINT.label} - Files - ${(<CompanyName id={relatedObjectId} />)} - Companies`
    heading = `Delete a ${DOCUMENT_TYPES.SHAREPOINT.label}`
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
      {(file) => (
          <>
              <SharePointForm file={file} />
            <pre>{JSON.stringify(file)}</pre>
          </>
        )}
        </FileResource>
      </FormLayout>
    </DefaultLayout>
  )
}

export default DeleteFile
