import React from 'react'
import { Link } from 'govuk-react'
import { Link as ReactRouterLink } from 'react-router-dom'

import { ExportWinTitle, ExportWinSubTitle } from '.'

import { ExportWinsLink, VerticalSpacer } from '../Details'
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
        link: urls.companies.exportWins.edit(
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
    <VerticalSpacer>
      <Link
        as={ReactRouterLink}
        to={urls.companies.exportWins.edit(
          match.params.companyId,
          match.params.winId
        )}
      >
        Back
      </Link>
      <ExportWinsLink />
    </VerticalSpacer>
  </DefaultLayout>
)

export default EditSuccess
