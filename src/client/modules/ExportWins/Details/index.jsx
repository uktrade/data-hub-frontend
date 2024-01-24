import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'govuk-react'
import { Link as ReactRouterLink } from 'react-router-dom/cjs/react-router-dom'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { DefaultLayout, SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import { formatMediumDate } from '../../../utils/date'
import { currencyGBP } from '../../../utils/number-utils'
import ExportWin from '../../../components/Resource/ExportWin'

const VerticalSpacer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SCALE_1};
  margin-bottom: ${SPACING.SCALE_5};
`

const ExportWinTitle = (props) => (
  <ExportWin.Inline {...props}>
    {(exportWin) => (
      <>
        {exportWin.name_of_export} to {exportWin.country?.name}
      </>
    )}
  </ExportWin.Inline>
)

// TODO: Use the same functionality as in the create export win form
const f = (breakdowns) =>
  breakdowns.reduce(
    (a, x) => ({
      ...a,
      [x.type.name]: {
        // years: [...(a[x.type.name]?.years || []), x.year],
        yearCount: (a[x.type.name]?.yearCount || 0) + 1,
        // values: [...(a[x.type.name]?.values || []), x.value],
        total: (a[x.type.name]?.total || 0) + x.value,
      },
    }),
    {}
  )

const Detail = () => (
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
        <ExportWin id={winId} progressBox={true}>
          {(exportWin) => (
            <>
              <SummaryTable>
                <SummaryTable.Row heading="UK Company">
                  {exportWin && (
                    <Link href={urls.companies.detail(exportWin.company.id)}>
                      {exportWin.company.name}
                    </Link>
                  )}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Contact">
                  {exportWin && (
                    <Link
                      href={urls.contacts.contact(
                        exportWin.companyContacts[0].id
                      )}
                    >
                      {exportWin.companyContacts[0].name}
                    </Link>
                  )}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Goods or services">
                  {exportWin?.goodsVsServices.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Destination country">
                  {exportWin?.country.name}
                </SummaryTable.Row>
                {exportWin &&
                  Object.entries(f(exportWin.breakdowns)).map(
                    ([k, { total, yearCount }]) => (
                      <SummaryTable.Row key={k} heading={k}>
                        {`${currencyGBP(total)} over ${yearCount} years`}
                      </SummaryTable.Row>
                    )
                  )}
                <SummaryTable.Row heading="Export amount">
                  {exportWin && currencyGBP(exportWin.totalExpectedExportValue)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Date won">
                  {exportWin && formatMediumDate(exportWin.date)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Last modified">
                  {exportWin && formatMediumDate(exportWin.modifiedOn)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Lead officer name">
                  {exportWin?.leadOfficer.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Customer response">
                  {exportWin?.customerResponse?.comments}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Export win confirmed">
                  {exportWin &&
                    (exportWin.isLineManagerConfirmed ? 'Yes' : 'No')}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Date of feedback">
                  {formatMediumDate(exportWin?.customerResponse?.createdOn)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Adviser(s)">
                  {exportWin?.advisers.map(
                    ({ adviser, teamType }) =>
                      `${adviser.name} — ${teamType.name}`
                  )}
                </SummaryTable.Row>
              </SummaryTable>
              <VerticalSpacer>
                {exportWin?.isLineManagerConfirmed && (
                  <Link
                    as={ReactRouterLink}
                    to={urls.companies.exportWins.customerFeedback(winId)}
                  >
                    View customer feedback
                  </Link>
                )}
                <Link
                  as={ReactRouterLink}
                  to={urls.companies.exportWins.index()}
                >
                  Export wins
                </Link>
              </VerticalSpacer>
            </>
          )}
        </ExportWin>
      </DefaultLayout>
    )}
  </Route>
)

export default Detail
