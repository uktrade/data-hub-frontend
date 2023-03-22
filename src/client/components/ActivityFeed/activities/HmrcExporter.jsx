import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'

import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

const { format } = require('../../../utils/date')

export default class HmrcExporter extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.HmrcExporter)
  }

  render() {
    const { activity, isOverview } = this.props

    const startTime = get(activity, 'object.startTime')
    const summary = get(activity, 'summary')
    const exportItemCodes = get(activity, 'object.dit:exportItemCodes')

    const exportItemCodesList = exportItemCodes.map((value) =>
      isOverview ? (
        `${value}`
      ) : (
        <span key={value}>
          {value}
          <br />
        </span>
      )
    )
    const date = format(startTime)
    const metadata = [
      { label: 'Date', value: date },
      { label: 'Export item code(s)', value: exportItemCodesList },
    ]

    const kind = 'HMRC Update'

    return isOverview ? (
      <ActivityCardWrapper dataTest="hmrc-exporter-activity-summary">
        <ActivityOverviewSummary
          activity={activity}
          date={date}
          kind={'Exporters Record'}
          subject={summary}
          summary={[kind]}
        ></ActivityOverviewSummary>
      </ActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="hmrc-exporter-activity">
        <ActivityCardLabels
          isExternalActivity={true}
          theme="HMRC"
          service="Exporters Record"
          kind={kind}
        />
        <ActivityCardSubject>{summary}</ActivityCardSubject>
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}
