import React from 'react'
import { Link } from 'govuk-react'
import { Link as ReactRouterLink } from 'react-router-dom'

import { ExportWinTitle, ExportWinSubTitle } from '.'

import { ExportWinsLink, VerticalSpacerWithMarginBottom } from '../Shared'
import { DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'

const EditSuccess = ({ match }) => (
  <DefaultLayout
    pageTitle="Success"
    heading={<ExportWinTitle id={match.params.winId} />}
    subheading={<ExportWinSubTitle id={match.params.winId} />}
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
        link: urls.companies.exportWins.sent(),
        text: 'Sent',
      },
      {
        link: urls.companies.exportWins.editSummary(
          match.params.companyId,
          match.params.winId
        ),
        text: <ExportWinSubTitle id={match.params.winId} />,
      },
      {
        link: urls.companies.exportWins.sent(),
        text: 'Success',
      },
    ]}
    flashMessages={{ success: ['The export win has been updated.'] }}
  >
    <VerticalSpacerWithMarginBottom>
      <Link
        as={ReactRouterLink}
        to={urls.companies.exportWins.editSummary(
          match.params.companyId,
          match.params.winId
        )}
      >
        Back
      </Link>
      <ExportWinsLink />
    </VerticalSpacerWithMarginBottom>
  </DefaultLayout>
)

export default EditSuccess
