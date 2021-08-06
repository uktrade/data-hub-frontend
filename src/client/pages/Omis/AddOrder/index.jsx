import React from 'react'
import { Link } from 'react-router-dom'

import Default from '../../../components/Layout/Default'

const AddOrder = () => (
  <>
    <Default>
      Time to add an order <Link to="/omis/react">Go back</Link>
    </Default>
  </>
)

export default AddOrder
