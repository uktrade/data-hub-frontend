import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'

import {
  Card,
  CardDetails,
  CardDetailsList,
  CardHeader,
  CardTable,
} from './card'

import { DefaultItemRenderer } from './card/item-renderers'

import CardUtils from './card/CardUtils'
import {
  ACTIVITY_TYPE,
  ANALYTICS_ACCORDION_TYPE,
  SOURCE_TYPES,
} from '../constants'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { COMPANY_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'

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
    const { activity, showDetails, showDnbHierarchy } = this.props

    const company = CardUtils.getCompany(activity)
    const startTime = get(activity, 'object.startTime')
    const reference = get(activity, 'object.attributedTo.name')
    const summary = get(activity, 'summary')
    const exportItemCodes = get(activity, 'object.dit:exportItemCodes')
    const exportItemCodesCollection = exportItemCodes.map((value) => {
      return {
        value,
        id: value,
      }
    })

    return (
      <CheckUserFeatureFlag userFeatureFlagName={COMPANY_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
            <Card>
              <CardHeader
                company={showDnbHierarchy ? company : null}
                blockText="HMRC"
                subHeading="Exporters record"
                heading={summary}
                sourceType={SOURCE_TYPES.external}
                startTime={startTime}
              />

              <CardDetails
                summary="View key export details"
                summaryVisuallyHidden={` for ${reference}`}
                showDetails={showDetails}
                analyticsAccordionType={ANALYTICS_ACCORDION_TYPE.HMRC}
              >
                <CardTable
                  rows={[
                    { header: 'Company name', content: reference },
                    {
                      header: 'Export Item code(s)',
                      content: (
                        <CardDetailsList
                          itemPropName="value"
                          itemRenderer={DefaultItemRenderer}
                          items={exportItemCodesCollection}
                        />
                      ),
                    },
                  ]}
                />
              </CardDetails>
            </Card>
          ) : (
            <ActivityCardWrapper dataTest="hmrc-exporter-activity">
              <ActivityCardLabels kind="HMRC Update" />
              <h3>HMRC Exporters</h3>
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}
