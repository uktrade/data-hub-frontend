import React from 'react'
import { useParams } from 'react-router-dom'

import { TASK_GET_EXPORT_WIN, TASK_GET_EXPORT_PROJECT } from './state'
import ExportWinForm from './ExportWinForm'
import ExportWin from '../../../components/Resource/ExportWin'
import { CompanyResource } from '../../../components/Resource'
import { WIN_STATUS_MAP_TO_LABEL } from '../Status/constants'
import urls from '../../../../lib/urls'

export const CompanyName = ({ companyId }) => (
  <CompanyResource.Inline id={companyId}>
    {(company) => company.name.toUpperCase()}
  </CompanyResource.Inline>
)

export const ExportWinTitle = (props) => (
  <ExportWin.Inline {...props}>
    {({ customerResponse }) => (
      <>{`${WIN_STATUS_MAP_TO_LABEL[customerResponse.agreeWithWin]} export win`}</>
    )}
  </ExportWin.Inline>
)

export const ExportWinSubTitle = (props) => (
  <ExportWin.Inline {...props}>
    {(exportWin) => (
      <>
        {exportWin.nameOfExport} to {exportWin.country?.name}
      </>
    )}
  </ExportWin.Inline>
)

const ExportWinStatus = (props) => (
  <ExportWin.Inline {...props}>
    {({ customerResponse }) => (
      <>{WIN_STATUS_MAP_TO_LABEL[customerResponse.agreeWithWin]}</>
    )}
  </ExportWin.Inline>
)

// If we're converting an export project to an export win
// then we'll have the export id, otherwise we're creating
// the export win from scratch.
export const CreateExportWin = () => {
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  return (
    <ExportWinForm
      heading="Add export win"
      subheading={<CompanyName companyId={queryParams.companyId} />}
      exportId={queryParams.exportId}
      companyId={queryParams.companyId}
      initialValuesTaskName={
        queryParams.exportId ? TASK_GET_EXPORT_PROJECT : null
      }
      initialValuesPayload={{ id: queryParams.exportId }}
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        {
          link: urls.companies.detail(queryParams.companyId),
          text: <CompanyName companyId={queryParams.companyId} />,
        },
        { text: 'Add export win' },
      ]}
    />
  )
}

// Here we're editing an existing win so we'll have the export win id.
export const EditExportWin = () => {
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  return (
    <ExportWinForm
      heading={<ExportWinTitle id={queryParams.winId} />}
      subheading={<ExportWinSubTitle id={queryParams.winId} />}
      isEditing={true}
      companyId={queryParams.companyId}
      exportWinId={queryParams.winId}
      initialValuesTaskName={TASK_GET_EXPORT_WIN}
      initialValuesPayload={{
        id: queryParams.winId,
      }}
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        {
          link: urls.companies.exportWins.pending(),
          text: 'Export wins',
        },
        { text: <ExportWinStatus id={queryParams.winId} /> },
      ]}
    />
  )
}
