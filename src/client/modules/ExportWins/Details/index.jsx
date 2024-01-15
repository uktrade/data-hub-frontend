import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'govuk-react'

import { DefaultLayout, SummaryTable } from '../../../components'

import ProgressIndicator from '../../../components/ProgressIndicator'
import urls from '../../../../lib/urls'
import { formatMediumDate } from '../../../utils/date'
import { currencyGBP } from '../../../utils/number-utils'

import ExportWin from '../../../components/Resource/ExportWin'

// TODO: Get rid of this, it would be hard to explain why it's needed
const Summary = ({ rows, ...props }) => (
  <SummaryTable {...props}>
    {rows.map(([heading, content]) => (
      <SummaryTable.Row key={heading} heading={heading}>
        {content}
      </SummaryTable.Row>
    ))}
  </SummaryTable>
)

const ExportWinTitle = (props) => (
  <ExportWin.Inline
    {...props}
    taskStatusProps={{
      renderProgress: ProgressIndicator.Inline,
    }}
  >
    {(exportWin) => (
      <>
        {exportWin.name_of_export} to {exportWin.country?.name}
      </>
    )}
  </ExportWin.Inline>
)

export default () => (
  <Route>
    {({
      match: {
        params: { winId },
      },
    }) => (
      <DefaultLayout
        heading={<ExportWinTitle id={winId} />}
        pageTitle={<ExportWinTitle id={winId} />}
        breadcrumbs={[
          {
            link: urls.dashboard.index(),
            text: 'Home',
          },
          {
            link: urls.companies.exportWins.index(),
            text: 'Export wins',
          },
          { text: <ExportWinTitle id={winId} /> },
        ]}
      >
        <Summary
          rows={[
            [
              'UK Company',
              <ExportWin.Inline noun="UK company" id={winId}>
                {({ company: { name, id } }) => (
                  <Link href={urls.companies.detail(id)}>{name}</Link>
                )}
              </ExportWin.Inline>,
            ],
            [
              'Contact',
              <ExportWin.Inline noun="contact" id={winId}>
                {({ companyContacts: [{ name, id }] }) => (
                  <Link href={urls.contacts.contact(id)}>{name}</Link>
                )}
              </ExportWin.Inline>,
            ],
            [
              'Goods or services',
              <ExportWin.Detail
                at="goodsVsServices.name"
                noun="goods or services"
                id={winId}
              />,
            ],
            [
              'Destination',
              <ExportWin.Detail
                at="country.name"
                noun="destination"
                id={winId}
              />,
            ],
            [
              'Export amount',
              <ExportWin.Detail
                at="totalExpectedExportValue"
                noun="export amount"
                id={winId}
                children={currencyGBP}
              />,
            ],
            [
              'Date won',
              <ExportWin.Detail
                at="date"
                noun="date won"
                id={winId}
                children={formatMediumDate}
              />,
            ],
            [
              'Last modified',
              <ExportWin.Detail
                at="modifiedOn"
                noun="last modified"
                id={winId}
                children={formatMediumDate}
              />,
            ],
            [
              'Lead officer name',
              <ExportWin.Detail
                at="leadOfficer.name"
                noun="lead officer"
                id={winId}
              />,
            ],
            [
              'Customer response',
              <ExportWin.Detail
                at="customerResponse.comments"
                noun="customer response"
                id={winId}
              />,
            ],
            [
              'Export win confirmed',
              <ExportWin.Detail
                at="isLineManagerConfirmed"
                noun="confirmed"
                id={winId}
                children={(x) => (x ? 'Yes' : 'No')}
              />,
            ],
            [
              'Date of feedback',
              // '???',
              <ExportWin.Detail
                at="customerResponse.createdOn"
                noun="date of feedback"
                id={winId}
                children={formatMediumDate}
              />,
            ],
            [
              'Adviser(s)',
              <ExportWin.Inline noun="advisers" id={winId}>
                {({ advisers }) =>
                  advisers
                    .map(
                      ({ adviser, teamType }) =>
                        `${adviser.name} — ${teamType.name}`
                    )
                    .join(', ')
                }
              </ExportWin.Inline>,
            ],
          ]}
        />
        <ExportWin
          id={winId}
          taskStatusProps={{
            renderProgress: ProgressIndicator.Inline,
          }}
        >
          {(exportWin) => <pre>{JSON.stringify(exportWin, null, 2)}</pre>}
        </ExportWin>
      </DefaultLayout>
    )}
  </Route>
)
