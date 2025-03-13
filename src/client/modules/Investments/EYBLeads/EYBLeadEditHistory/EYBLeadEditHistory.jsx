import React from 'react'
import { useParams } from 'react-router-dom'

import {
  EYBLeadResource,
  EYBLeadAuditHistoryResource,
} from '../../../../components/Resource'
import { AuditHistory, DefaultLayout } from '../../../../components'
import { getValue, mapFieldNameToLabel } from './transformers'
import urls from '../../../../../lib/urls'
import { EXCLUDED_FIELDS } from './constants'

const EYBLeadName = ({ id }) => (
  <EYBLeadResource id={id}>{(eybLead) => eybLead.company.name}</EYBLeadResource>
)

const EYBLeadEditHistory = () => {
  const { eybLeadId } = useParams()

  return (
    <DefaultLayout
      pageTitle={
        <>
          Edit history - EYB lead details - <EYBLeadName id={eybLeadId} /> -
          Investments
        </>
      }
      heading="Edit history"
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.investments.index(),
          text: 'Investments',
        },
        {
          link: urls.investments.eybLeads.index(),
          text: 'EYB leads',
        },
        {
          link: urls.investments.eybLeads.details(eybLeadId),
          text: <EYBLeadName id={eybLeadId} />,
        },
        { text: 'Edit history' },
      ]}
    >
      <AuditHistory
        resource={EYBLeadAuditHistoryResource}
        id={eybLeadId}
        valueTransformer={getValue}
        fieldMapper={mapFieldNameToLabel}
        excludedFields={EXCLUDED_FIELDS}
        auditType="eyb details"
        showSort={false}
      />
    </DefaultLayout>
  )
}

export default EYBLeadEditHistory
