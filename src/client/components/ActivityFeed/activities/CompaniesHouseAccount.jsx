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
    const { activity } = this.props
    const startTime = get(activity, 'object.startTime')
    const summary = get(activity, 'summary')
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
}
