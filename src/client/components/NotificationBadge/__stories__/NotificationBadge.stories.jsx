import React from 'react'

import NotificationBadge from 'NotificationBadge'

export default {
  title: 'NotificationBadge',

  parameters: {
    component: NotificationBadge,
  },
}

export const Default = () => <NotificationBadge value={3} />
