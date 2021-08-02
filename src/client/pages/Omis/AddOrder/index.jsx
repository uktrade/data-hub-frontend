import React from 'react'
import { Link } from 'react-router-dom'

import FullWidth from '../../../components/Layout/FullWidth'

const AddOrder = () => (
  <FullWidth>
    Time to add an order <Link to="/omis/react">Go back</Link>
  </FullWidth>
)

export default AddOrder
