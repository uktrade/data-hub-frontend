import React from 'react'
import { get } from 'lodash'

import PropTypes from 'prop-types'
import { Card, CardDetails, CardHeader, CardTable } from './card'

import CardUtils from './card/CardUtils'
import { currencyGBP } from '../../../utils/number-utils'
import {
  ACTIVITY_TYPE,
  ANALYTICS_ACCORDION_TYPE,
  SOURCE_TYPES,
} from '../constants'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { CONTACT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardSubject from './card/ActivityCardSubject'

const { format } = require('../../../utils/date')

export default class CompaniesHouseAccount extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(
      activity,
      ACTIVITY_TYPE.CompaniesHouseAccount
    )
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props
    const startTime = get(activity, 'object.startTime')
    const taxonomy = get(activity, 'dit:taxonomy')
    const summary = get(activity, 'summary')
    const company = CardUtils.getCompany(activity)
    const balanceSheetDate = format(
      get(activity, 'object.dit:balanceSheetDate')
    )
    const netAssetsLiabilities = currencyGBP(
      get(
        activity,
        'object.dit:netAssetsLiabilitiesIncludingPensionAssetLiability'
      )
    )
    const periodEnd = format(get(activity, 'object.dit:periodEnd'))
    const periodStart = format(get(activity, 'object.dit:periodStart'))
    const shareholderFunds = currencyGBP(
      get(activity, 'object.dit:shareholderFunds')
    )
    const metadata = [
      { label: 'Date', value: format(startTime) },
      { label: 'Balance sheet date', value: balanceSheetDate },
      {
        label: 'Net assets liabilities including pension asset liability',
        value: netAssetsLiabilities,
      },
      { label: 'Period start', value: periodStart },
      { label: 'Period end', value: periodEnd },
      { label: 'Shareholder funds', value: shareholderFunds },
    ]

    return (
      <CheckUserFeatureFlag userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
            <Card>
              <CardHeader
                company={showDnbHierarchy ? company : null}
                heading={summary}
                blockText="Companies House"
                sourceType={SOURCE_TYPES.external}
                subHeading="Accounts record"
                startTime={startTime}
              />

              <CardDetails
                summary="View key details for this account"
                summaryVisuallyHidden={`${summary} in Companies House`}
                link={{ taxonomy, text: 'Companies House accounts' }}
                showDetails={showDetails}
                analyticsAccordionType={
                  ANALYTICS_ACCORDION_TYPE.COMPANIES_HOUSE
                }
              >
                <CardTable
                  rows={[
                    { header: 'Balance sheet date', content: balanceSheetDate },
                    {
                      header:
                        'Net assets liabilities including pension asset liability',
                      content: netAssetsLiabilities,
                    },
                    { header: 'Period start', content: periodStart },
                    { header: 'Period end', content: periodEnd },
                    { header: 'Shareholder funds', content: shareholderFunds },
                  ]}
                />
              </CardDetails>
            </Card>
          ) : (
            <ActivityCardWrapper dataTest="companies-house-account-activity">
              <ActivityCardLabels
                isExternalActivity={true}
                theme="Companies House"
                service="Accounts Record"
                kind="Companies House Update"
              ></ActivityCardLabels>
              <ActivityCardSubject>{summary}</ActivityCardSubject>
              <ActivityCardMetadata metadata={metadata} />
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}
