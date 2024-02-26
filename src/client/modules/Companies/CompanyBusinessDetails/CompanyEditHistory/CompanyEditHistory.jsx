import React from 'react'
import { useParams } from 'react-router-dom'

import {
  CompanyResource,
  CompanyAuditHistoryResource,
} from '../../../../components/Resource'
import { CollectionItem, DefaultLayout } from '../../../../components'
import { transformResponseToCollection } from './transformers'
import urls from '../../../../../lib/urls'

const CompanyName = ({ id }) => (
  <CompanyResource.Inline id={id}>
    {(company) => company.name}
  </CompanyResource.Inline>
)

const CompanyEditHistory = () => {
  const { companyId } = useParams()
  return (
    <DefaultLayout
      pageTitle={
        <>
          Edit history - Business details - <CompanyName id={companyId} /> -
          Companies
        </>
      }
      heading="Edit history"
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        {
          link: urls.companies.detail(companyId),
          text: <CompanyName id={companyId} />,
        },
        {
          link: urls.companies.businessDetails(companyId),
          text: 'Business details',
        },
        { text: 'Edit history' },
      ]}
    >
      <CompanyAuditHistoryResource.Paginated
        id={`v4/company/${companyId}/audit`}
      >
        {(companyAuditHistory) => (
          <ul>
            {transformResponseToCollection(companyAuditHistory).map((item) => (
              <CollectionItem
                key={item.id}
                headingText={item.headingText}
                metadata={item.metadata}
                badges={item.badges}
              />
            ))}
          </ul>
        )}
      </CompanyAuditHistoryResource.Paginated>
    </DefaultLayout>
  )
}

export default CompanyEditHistory
