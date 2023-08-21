import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { AdviserItemRenderer, ContactItemRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import { currencyGBP, decimal } from '../../../utils/number-utils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

const { format } = require('../../../utils/date')

export default class InvestmentProject extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.InvestmentProject)
  }

  render() {
    const kind = 'New Investment Project'
    const { activity, isOverview } = this.props
    const url = get(activity, 'object.url')
    const name = get(activity, 'object.name')
    const investmentType = get(activity, 'object.dit:investmentType.name')
    const adviser = CardUtils.getAdviser(activity)
    const estimatedLandDate = format(
      get(activity, 'object.dit:estimatedLandDate')
    )
    const contacts = CardUtils.getContacts(activity)

    // Specific to Foreign direct investment (FDI) only
    const totalInvestment = currencyGBP(
      get(activity, 'object.dit:totalInvestment')
    )
    const foreignEquityInvestment = currencyGBP(
      get(activity, 'object.dit:foreignEquityInvestment')
    )
    const grossValueAdded = currencyGBP(
      get(activity, 'object.dit:grossValueAdded')
    )
    const numberNewJobs = decimal(get(activity, 'object.dit:numberNewJobs'))

    const published = get(activity, 'published')

    const addedBy = [adviser].map((adviser) => <>{adviser?.name}</>)

    const metadata = [
      { label: 'Date', value: format(published) },
      { label: 'Investment Type', value: investmentType },
      {
        label: 'Added by',
        value: [adviser].map((adviser, index) =>
          adviser ? (
            <span key={adviser.id}>{AdviserItemRenderer(adviser, index)}</span>
          ) : (
            <></>
          )
        ),
      },
      {
        label: 'Estimated land date',
        value: estimatedLandDate,
      },
      {
        label: 'Company contact',
        value: contacts.map((contact, index) => (
          <span key={contact.id}>{ContactItemRenderer(contact, index)}</span>
        )),
      },
      { label: 'Total investment', value: totalInvestment },
      {
        label: 'Capital expenditure value',
        value: foreignEquityInvestment,
      },
      {
        label: 'Gross value added (GVA)',
        value: grossValueAdded,
      },
      { label: 'Number of jobs', value: numberNewJobs },
    ]
    const subject = <Link href={`${url}/details`}>{name}</Link>
    const summary = [
      `${investmentType} investment for ${numberNewJobs} jobs added by `,
      addedBy,
    ]
    return isOverview ? (
      <ActivityCardWrapper dataTest="investment-activity-summary">
        <ActivityOverviewSummary
          activity={activity}
          date={format(published)}
          kind={kind}
          url={url}
          subject={subject}
          summary={summary}
        ></ActivityOverviewSummary>
      </ActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="investment-activity">
        <ActivityCardSubject dataTest="investment-activity-card-subject">
          {subject}
        </ActivityCardSubject>
        <ActivityCardLabels
          theme="Investment"
          service="Project - FDI"
          kind={kind}
        />
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}
