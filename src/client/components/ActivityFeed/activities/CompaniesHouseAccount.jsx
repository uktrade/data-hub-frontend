import React from 'react'
import { get } from 'lodash'

import PropTypes from 'prop-types'
import { Card, CardDetails, CardHeader, CardTable } from './card'

import CardUtils from './card/CardUtils'
import { currencyGBP } from '../../../utils/number-utils'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'

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

    return (
      <Card>
        <CardHeader
          company={showDnbHierarchy ? company : null}
          heading={summary}
          blockText="Companies House"
          sourceType={SOURCE_TYPES.external}
          subHeading="Accounts records"
          startTime={startTime}
        />

        <CardDetails
          summary="View key details for this account"
          summaryVisuallyHidden={`${company} in Companies House`}
          link={{ taxonomy, text: 'Go to the Companies House accounts page' }}
          showDetails={showDetails}
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
    )
  }
}
