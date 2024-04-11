import React from 'react'
import { H4 } from '@govuk-react/heading'

import ExportWin from '../../../components/Resource/ExportWin'
import { ExportWinsLink, VerticalSpacerWithMarginBottom } from '../Shared'
import { DefaultLayout } from '../../../components'
import urls from '../../../../lib/urls'

export const ExportWinSuccess = ({ winId }) => (
  <ExportWin.Inline id={winId}>
    {(exportWin) =>
      exportWin &&
      `The export win ${exportWin.nameOfExport} to ${exportWin.country.name} has been` +
        ` sent to ${exportWin.companyContacts[0].email} for review and confirmation.`
    }
  </ExportWin.Inline>
)

const Success = ({ match }) => (
  <DefaultLayout
    pageTitle="Success"
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
        text: 'Success',
      },
    ]}
    flashMessages={{
      success: [<ExportWinSuccess winId={match.params.winId} />],
    }}
  >
    <H4 data-test="heading" as="h2">
      What happens next?
    </H4>
    <p data-test="review">
      The customer will review the export win and have the option to provide
      feedback.
    </p>
    <p data-test="email">
      You will be sent an email once the customer has responded.
    </p>
    <VerticalSpacerWithMarginBottom>
      <ExportWinsLink />
    </VerticalSpacerWithMarginBottom>
  </DefaultLayout>
)

export default Success
