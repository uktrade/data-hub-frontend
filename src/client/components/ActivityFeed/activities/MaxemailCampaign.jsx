import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import {
  Card,
  CardDetails,
  CardDetailsList,
  CardHeader,
  CardTable,
} from './card'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'
import CardUtils from './card/CardUtils'

import { ContactItemRenderer } from './card/item-renderers'

export default class MaxemailCampaign extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return (
      CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.MaxemailCampaign) &&
      get(activity, 'object.contacts').length
    )
  }

  render() {
    const { activity, showDetails } = this.props
    const published = get(activity, 'published')
    const name = get(activity, 'actor.name')
    const from = get(activity, 'actor.dit:emailAddress')
    const emailSubject = get(activity, 'object.dit:emailSubject')
    const contacts = get(activity, 'object.contacts')
    const content = get(activity, 'object.content')

    return (
      <Card>
        <CardHeader
          heading={emailSubject}
          blockText="Email Campaign"
          startTime={published}
          sourceType={SOURCE_TYPES.external}
        />

        <CardDetails
          summary="View details of this campaign"
          showDetails={showDetails}
        >
          <CardTable
            rows={[
              { header: 'Senders name', content: name },
              { header: 'Senders email', content: from },
              { header: 'Content', content },
              {
                header: 'Recipients',
                content: (
                  <CardDetailsList
                    itemPropName="email"
                    itemRenderer={ContactItemRenderer}
                    items={contacts}
                  />
                ),
              },
            ]}
          />
        </CardDetails>
      </Card>
    )
  }
}
