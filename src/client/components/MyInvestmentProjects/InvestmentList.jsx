import React from 'react'
import PropTypes from 'prop-types'

import InvestmentListItem from './InvestmentListItem'

const InvestmentList = ({ items }) => (
  <>
    {items.map((item) => (
      <InvestmentListItem key={item.id} {...item} />
    ))}
  </>
)

InvestmentList.propTypes = {
  items: PropTypes.array.isRequired,
}

export default InvestmentList
