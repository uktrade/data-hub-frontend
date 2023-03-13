import React from 'react'
import urls from '../../../lib/urls'
import { LocalHeader } from '../../components'

const ThankYou = ({ flashMessages }) => (
  <LocalHeader
    heading={'Thank you'}
    breadcrumbs={[
      { link: urls.dashboard(), text: 'Home' },
      {
        link: urls.support.index(),
        text: 'Leave feedback',
      },
      {
        text: 'Thank you',
      },
    ]}
    flashMessages={flashMessages}
  />
)

export default ThankYou
