import React from 'react'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  ExportWinTitle,
  ExportWinsLink,
  VerticalSpacerWithMarginBottom,
} from './Shared'

import ExportWin from '../../components/Resource/ExportWin'
import SummaryTable from '../../components/SummaryTable'
import { DefaultLayout } from '../../components'
import urls from '../../../lib/urls'
import AccessibleLink from '../../components/Link'

const toYesNo = (val) => {
  if (val === undefined || val === null) return
  return val ? 'Yes' : 'No'
}

const SummaryTable60PerCentHeader = styled(SummaryTable)({
  '&& th': {
    width: '60%',
  },
})

const CustomerFeedback = () => {
  // TODO: Both companyId and winId should be passed as props. Using a hook
  // here means we're tightly coupling the component to some route which has
  // companyId and winId params in the route.
  const { companyId, winId } = useParams()
  return (
    <DefaultLayout
      heading="Customer feedback"
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
        {
          text: <ExportWinTitle id={winId} />,
          link: urls.companies.exportWins.editSummary(companyId, winId),
        },
        { text: 'Customer feedback' },
      ]}
    >
      <ExportWin id={winId} progressBox={true}>
        {(_, win) => {
          const response = win?.customer_response || {}
          return (
            <>
              <SummaryTable60PerCentHeader caption="1. To what extent did our support help in?">
                <SummaryTable.Row heading="Securing the win overall?">
                  {response.our_support?.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Gaining access to contacts?">
                  {response.access_to_contacts?.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Getting information or improved understanding of this country?">
                  {response.access_to_information?.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Improving your profile or credibility in the country?">
                  {response.improved_profile?.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Having confidence to explore or expand in the country?">
                  {response.gained_confidence?.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Developing or nurturing critical relationships?">
                  {response.developed_relationships?.name}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Overcoming a problem in the country (eg legal, regulatory, commercial)">
                  {response.overcame_problem?.name}
                </SummaryTable.Row>
              </SummaryTable60PerCentHeader>
              <SummaryTable60PerCentHeader caption="2. About this win">
                <SummaryTable.Row heading="The win involved a foreign government or state-owned enterprise (eg as an intermediary or facilitator)">
                  {toYesNo(response.involved_state_enterprise)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Our support was a prerequisite to generate this value">
                  {toYesNo(response.interventions_were_prerequisite)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Our support helped you achieve this win more quickly">
                  {toYesNo(response.support_improved_speed)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="It enabled you to expand into a new market">
                  {toYesNo(response.has_enabled_expansion_into_new_market)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="It enabled you to maintain or expand in an existing market">
                  {toYesNo(response.has_enabled_expansion_into_existing_market)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="It enabled you to increase exports as a proportion of your turnover">
                  {toYesNo(
                    response.has_increased_exports_as_percent_of_turnover
                  )}
                </SummaryTable.Row>
                <SummaryTable.Row heading="If you hadn't achieved this win, your company might have stopped exporting">
                  {toYesNo(response.company_was_at_risk_of_not_exporting)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="Apart from this win, you already have plans to export in the next 12 months">
                  {toYesNo(response.has_explicit_export_plans)}
                </SummaryTable.Row>
              </SummaryTable60PerCentHeader>
              <SummaryTable60PerCentHeader caption="3. Your export experience">
                <SummaryTable.Row heading="Apart from this win, when did your company last export goods or services?">
                  {response.last_export?.name}
                </SummaryTable.Row>
              </SummaryTable60PerCentHeader>
              <SummaryTable60PerCentHeader caption="4. Marketing">
                <SummaryTable.Row heading="Would you be willing for DBT/Exporting is GREAT to feature your success in marketing materials?">
                  {toYesNo(response.case_study_willing)}
                </SummaryTable.Row>
                <SummaryTable.Row heading="How did you first hear about DBT(or it predecessor, DIT)?">
                  {response.marketing_source?.name}
                </SummaryTable.Row>
              </SummaryTable60PerCentHeader>
            </>
          )
        }}
      </ExportWin>
      <VerticalSpacerWithMarginBottom>
        <ExportWinsLink />
        <AccessibleLink
          as={ReactRouterLink}
          to={urls.companies.exportWins.editSummary(companyId, winId)}
        >
          Back
        </AccessibleLink>
      </VerticalSpacerWithMarginBottom>
    </DefaultLayout>
  )
}

export default CustomerFeedback
