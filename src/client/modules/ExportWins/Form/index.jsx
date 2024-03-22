import React from 'react'

import { TASK_GET_EXPORT_WIN, TASK_GET_EXPORT_PROJECT } from './state'
import ExportWinForm from './ExportWinForm'
import ExportWin from '../../../components/Resource/ExportWin'
import { CompanyResource } from '../../../components/Resource'
import { WIN_STATUS_MAP_TO_LABEL } from '../Status/constants'
import urls from '../../../../lib/urls'

const CompanyName = ({ companyId }) => (
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
export const CreateExportWin = ({ match }) => (
  <ExportWinForm
    heading="Add export win"
    subheading={<CompanyName companyId={match.params.companyId} />}
    exportId={match.params.exportId}
    companyId={match.params.companyId}
    initialValuesTaskName={
      match.params.exportId ? TASK_GET_EXPORT_PROJECT : null
    }
    initialValuesPayload={{ id: match.params.exportId }}
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
        link: urls.companies.detail(match.params.companyId),
        text: <CompanyName companyId={match.params.companyId} />,
      },
      { text: 'Add export win' },
    ]}
  />
)

// Here we're editing an existing win so we'll have the export win id.
export const EditExportWin = ({ match }) => (
  <ExportWinForm
    heading={<ExportWinTitle id={match.params.winId} />}
    subheading={<ExportWinSubTitle id={match.params.winId} />}
    isEditing={true}
    companyId={match.params.companyId}
    exportWinId={match.params.winId}
    initialValuesTaskName={TASK_GET_EXPORT_WIN}
    initialValuesPayload={{
      id: match.params.winId,
    }}
    breadcrumbs={[
      {
        link: urls.dashboard.index(),
        text: 'Home',
      },
      {
        link: urls.companies.exportWins.sent(),
        text: 'Export wins',
      },
      { text: <ExportWinStatus id={match.params.winId} /> },
    ]}
  />
)
