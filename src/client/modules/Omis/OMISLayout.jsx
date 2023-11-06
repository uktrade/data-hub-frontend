import React from 'react'

import { DefaultLayout } from '../../components'
import urls from '../../../lib/urls'

const OMISLayout = ({ heading, order, children }) => (
  <DefaultLayout
    heading={heading}
    pageTitle={`${heading} - ${order.reference} - Orders (OMIS)`}
    breadcrumbs={[
      {
        link: urls.dashboard.index(),
        text: 'Home',
      },
      {
        link: urls.omis.index(),
        text: 'Orders (OMIS)',
      },
      {
        link: urls.omis.order(order.id),
        text: order.reference,
      },
      { text: heading },
    ]}
  >
    {children}
  </DefaultLayout>
)

export default OMISLayout
