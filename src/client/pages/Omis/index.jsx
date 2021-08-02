import React from 'react'
import { Link } from 'react-router-dom'

import FullWidth from '../../components/Layout/FullWidth'

const Omis = () => (
  <FullWidth>
    I am the collection list page{' '}
    <Link to="/omis/react/add-order">Add order</Link>
  </FullWidth>
)

export default Omis
