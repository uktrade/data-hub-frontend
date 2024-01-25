import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'govuk-react'
import { Link as ReactRouterLink } from 'react-router-dom/cjs/react-router-dom'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { DefaultLayout, SummaryTable } from '../../components'
import urls from '../../../lib/urls'
import { formatMediumDate } from '../../utils/date'
import { currencyGBP } from '../../utils/number-utils'
import ExportWin from '../../components/Resource/ExportWin'

const VerticalSpacer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SCALE_1};
  margin-bottom: ${SPACING.SCALE_5};
`

const NormalFontWeightRow = styled(SummaryTable.Row)`
  & th {
    font-weight: normal;
  }
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
          {(exportWin) => {
            // TODO: Same / similar computation is used in the add export win form so it should be reused
            const {
              groupedBreakdowns = [],
              totalAmount,
              yearRange,
              totalYears = yearRange?.max - yearRange?.min + 1,
            } = exportWin?.breakdowns.reduce(
              ({ groupedBreakdowns, totalAmount, yearRange }, x) => ({
                totalAmount: totalAmount + x.value,
                yearRange: {
                  min: Math.min(yearRange.min, x.year),
                  max: Math.max(yearRange.max, x.year),
                },
                groupedBreakdowns: {
                  ...groupedBreakdowns,
                  [x.type.name]: {
                    yearCount:
                      (groupedBreakdowns[x.type.name]?.yearCount || 0) + 1,
                    total:
                      (groupedBreakdowns[x.type.name]?.total || 0) + x.value,
                  },
                },
              }),
              {
                groupedBreakdowns: {},
                totalAmount: 0,
                yearRange: { min: Infinity, max: 0 },
              }
            ) || {}

            return (
              <>
                <SummaryTable>
                  <SummaryTable.Row heading="Goods or services">
                    {exportWin?.goodsVsServices.name}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Destination country">
                    {exportWin?.country.name}
                  </SummaryTable.Row>
                  {exportWin &&
                    Object.keys(groupedBreakdowns).length > 1 &&
                    Object.entries(groupedBreakdowns).map(
                      ([k, { total, yearCount }]) => (
                        <NormalFontWeightRow key={k} heading={k}>
                          {`${currencyGBP(total)} over ${yearCount} years`}
                        </NormalFontWeightRow>
                      )
                    )}
                  <SummaryTable.Row heading="Total value">
                    {exportWin &&
                      `${currencyGBP(totalAmount)} over ${totalYears} years`}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Date won">
                    {exportWin && formatMediumDate(exportWin.date)}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Lead officer name">
                    {exportWin?.leadOfficer.name}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Comments">
                    {exportWin?.customerResponse?.comments}
                  </SummaryTable.Row>
                  <SummaryTable.Row heading="Export win confirmed">
                    {exportWin &&
                      (exportWin.isPersonallyConfirmed ? 'Yes' : 'No')}
                  </SummaryTable.Row>
                  {exportWin?.isPersonallyConfirmed &&
                    exportWin?.breakdowns.length === 0 && (
                      <SummaryTable.Row heading="What value do you estimate you would have achieved without our support?">
                        ???
                      </SummaryTable.Row>
                    )}
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
            )
          }}
        </ExportWin>
      </DefaultLayout>
    )}
  </Route>
)

export default Detail
