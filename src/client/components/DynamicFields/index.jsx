import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import SummaryTable from '../SummaryTable'

const DynamicFields = ({ items }) => {
  return Object.entries(items).map(([key, { label, value }]) => (
    <SummaryTable.Row key={key} heading={label}>
      {isEmpty(value) ? 'Not set' : 'Test-Value'}
    </SummaryTable.Row>
  ))
}

DynamicFields.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node,
    })
  ).isRequired,
}

export default DynamicFields
