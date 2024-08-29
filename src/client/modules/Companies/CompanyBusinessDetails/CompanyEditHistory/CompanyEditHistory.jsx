import React from 'react'
import { useParams } from 'react-router-dom'

import {
  CompanyResource,
  CompanyAuditHistoryResource,
} from '../../../../components/Resource'
import { AuditHistory, DefaultLayout } from '../../../../components'
import { getValue, mapFieldNameToLabel } from './transformers'
import urls from '../../../../../lib/urls'
import { EXCLUDED_FIELDS } from './constants'

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
      <AuditHistory
        resource={CompanyAuditHistoryResource}
        id={companyId}
        valueTransformer={getValue}
        fieldMapper={mapFieldNameToLabel}
        excludedFields={EXCLUDED_FIELDS}
        auditType="business details"
      />
    </DefaultLayout>
  )
}

export default CompanyEditHistory
