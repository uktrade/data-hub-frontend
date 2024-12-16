import React from 'react'
import { get } from 'lodash'

import PropTypes from 'prop-types'

import CardUtils from './card/CardUtils'
import { currencyGBP } from '../../../utils/number-utils'
import { ACTIVITY_TYPE } from '../constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'
import OverviewActivityCardWrapper from './card/OverviewActivityCardWrapper'

const { formatDate, DATE_FORMAT_COMPACT } = require('../../../utils/date-utils')

export default class CompaniesHouseAccount extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(
      activity,
      ACTIVITY_TYPE.CompaniesHouseAccount
    )
  }

  render() {
    const { activity, isOverview } = this.props
    const startTime = get(activity, 'object.startTime')
    const summary = get(activity, 'summary')
    const balanceSheetDate = formatDate(
      get(activity, 'object.dit:balanceSheetDate'),
      DATE_FORMAT_COMPACT
    )
    const netAssetsLiabilities = currencyGBP(
      get(
        activity,
        'object.dit:netAssetsLiabilitiesIncludingPensionAssetLiability'
      )
    )
    const periodEnd = formatDate(
      get(activity, 'object.dit:periodEnd'),
      DATE_FORMAT_COMPACT
    )
    const periodStart = formatDate(
      get(activity, 'object.dit:periodStart'),
      DATE_FORMAT_COMPACT
    )
    const shareholderFunds = currencyGBP(
      get(activity, 'object.dit:shareholderFunds')
    )
    const date = formatDate(startTime, DATE_FORMAT_COMPACT)
    const metadata = [
      { label: 'Date', value: date },
      { label: 'Balance sheet date', value: balanceSheetDate },
      {
        label: 'Net assets liabilities including pension asset liability',
        value: netAssetsLiabilities,
      },
      { label: 'Period start', value: periodStart },
      { label: 'Period end', value: periodEnd },
      { label: 'Shareholder funds', value: shareholderFunds },
    ]

    const kind = 'Companies House Updated'

    return isOverview ? (
      <OverviewActivityCardWrapper dataTest="companies-house-account-activity-summary">
        <ActivityOverviewSummary
          activity={activity}
          date={date}
          kind={'Accounts Record'}
          subject={summary}
          summary={kind}
        ></ActivityOverviewSummary>
      </OverviewActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="companies-house-account-activity">
        <ActivityCardSubject>{summary}</ActivityCardSubject>
        <ActivityCardLabels
          isExternalActivity={true}
          theme="Companies House"
          service="Accounts Record"
          kind={kind}
        ></ActivityCardLabels>
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}
