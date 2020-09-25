import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Card, CardHeader, CardTable } from './card'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { DateUtils } from '../utils'

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi)
  }

  render() {
    const { activity } = this.props
    const emailTo = get(activity, 'actor.dit:emailAddress')
    const sentDate = get(activity, 'object.published')

    return (
      <Card>
        <CardHeader
          heading={'Enquiry'}
          startTime={sentDate}
          badge={{ text: 'Badge', borderColour: '#006435' }}
        />

        <CardTable
          isNotWrappedInDetails={true}
          rows={[
            { header: 'Form', content: 'SomeForm' },
            { header: 'From', content: emailTo },
            {
              header: 'Sent on',
              content: DateUtils.format(sentDate),
            },
          ]}
        />
      </Card>
    )
  }
}
