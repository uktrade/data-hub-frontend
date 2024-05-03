import React from 'react'
import { Link } from 'govuk-react'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'

import { ExportWinTitle, ExportWinSubTitle } from '.'

import { ExportWinsLink, VerticalSpacerWithMarginBottom } from '../Shared'
import { DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'

const EditSuccess = () => {
  const { winId, companyId } = useParams()
  return (
    <DefaultLayout
      pageTitle="Success"
      heading={<ExportWinTitle id={winId} />}
      subheading={<ExportWinSubTitle id={winId} />}
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        {
          link: urls.companies.exportWins.index(),
          text: 'Export wins',
        },
        {
          link: urls.companies.exportWins.pending(),
          text: 'Pending',
        },
        {
          link: urls.companies.exportWins.editSummary(companyId, winId),
          text: <ExportWinSubTitle id={winId} />,
        },
        {
          link: urls.companies.exportWins.pending(),
          text: 'Success',
        },
      ]}
      flashMessages={{ success: ['The export win has been updated.'] }}
    >
      <VerticalSpacerWithMarginBottom>
        <Link
          as={ReactRouterLink}
          to={urls.companies.exportWins.editSummary(companyId, winId)}
        >
          Back
        </Link>
        <ExportWinsLink />
      </VerticalSpacerWithMarginBottom>
    </DefaultLayout>
  )
}

export default EditSuccess
