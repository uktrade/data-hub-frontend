import React from 'react'
import { Link } from 'govuk-react'
import { Link as ReactRouterLink } from 'react-router-dom/cjs/react-router-dom'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import pluralize from 'pluralize'

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
        {exportWin.nameOfExport} to {exportWin.country?.name}
      </>
    )}
  </ExportWin.Inline>
)

const groupBreakdowns = (breakdowns) => {
  const result =
    breakdowns.reduce(
      ({ groups: groups, totalAmount, yearRange }, breakdown) => {
        const group = groups[breakdown.type.name]

        return {
          totalAmount: totalAmount + breakdown.value,
          yearRange: {
            min: Math.min(yearRange.min, breakdown.year),
            max: Math.max(yearRange.max, breakdown.year),
          },
          groups: {
            ...groups,
            [breakdown.type.name]: {
              yearRange: {
                min: Math.min(group?.yearRange.min || Infinity, breakdown.year),
                max: Math.max(group?.yearRange.min || 0, breakdown.year),
              },
              total: (group?.total || 0) + breakdown.value,
            },
          },
        }
      },
      {
        groups: {},
        totalAmount: 0,
        yearRange: { min: Infinity, max: 0 },
      }
    ) || {}

  return {
    ...result,
    totalYears: result.yearRange.max - result.yearRange.min + 1,
  }
}

const Detail = ({
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
        const { groups, totalAmount, totalYears } = exportWin
          ? groupBreakdowns(exportWin.breakdowns)
          : {}

        return (
          <>
            <SummaryTable data-test="export-wins-details-table">
              <SummaryTable.Row heading="Goods or services">
                {exportWin?.goodsVsServices.name}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Destination country">
                {exportWin?.country.name}
              </SummaryTable.Row>
              {exportWin &&
                Object.keys(groups).length > 1 &&
                Object.entries(groups).map(([k, { total, yearRange }]) => {
                  const years = yearRange.max - yearRange.min + 1
                  return (
                    <NormalFontWeightRow key={k} heading={k}>
                      {`${currencyGBP(total)} over ${years} ${pluralize('year', years)}`}
                    </NormalFontWeightRow>
                  )
                })}
              <SummaryTable.Row heading="Total value">
                {exportWin &&
                  `${currencyGBP(totalAmount)} over ${totalYears} ${pluralize('year', totalYears)}`}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Date won">
                {exportWin && formatMediumDate(exportWin.date)}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Lead officer name">
                {exportWin?.leadOfficer.name}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Comments">
                {exportWin?.comments}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Export win confirmed">
                {exportWin && (exportWin.isPersonallyConfirmed ? 'Yes' : 'No')}
              </SummaryTable.Row>
            </SummaryTable>
            <VerticalSpacer>
              {exportWin?.isPersonallyConfirmed && (
                <Link
                  as={ReactRouterLink}
                  to={urls.companies.exportWins.customerFeedback(winId)}
                >
                  View customer feedback
                </Link>
              )}
              <Link
                data-test="export-wins-link"
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
)

export default Detail
