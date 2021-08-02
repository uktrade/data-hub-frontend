import React from 'react'
import { Link } from 'react-router-dom'

import LocalHeader from '../../../components/LocalHeader/LocalHeader'
import Default from '../../../components/Layout/Default'

const AddOrder = () => (
  <>
    <LocalHeader
      heading="Orders (OMIS)"
      breadcrumbs={[
        { link: '/', text: 'Home' },
        { to: '/omis/react', text: 'Orders (OMIS)' },
        { text: 'Add order' },
      ]}
    />
    <Default>
      Time to add an order <Link to="/omis/react">Go back</Link>
    </Default>
  </>
)

export default AddOrder
