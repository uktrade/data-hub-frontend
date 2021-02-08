import React from 'react'
import PropTypes from 'prop-types'
import { default as GovTable } from '@govuk-react/table'

const Table = ({ data, headers, total, url, queryParam }) => (
  <GovTable>
    <GovTable.Row>
      {headers.map((header, i) => (
        <GovTable.CellHeader key={i}>{header}</GovTable.CellHeader>
      ))}
    </GovTable.Row>
    {data.map(({ id, label, value }, i) => (
      <GovTable.Row key={i}>
        <GovTable.Cell>{label}</GovTable.Cell>
        <GovTable.Cell>
          <a href={`${url}?${queryParam}=${id}`} title={`View ${label}`}>
            {value}
          </a>
        </GovTable.Cell>
      </GovTable.Row>
    ))}
    <GovTable.Row>
      <GovTable.CellHeader>Total</GovTable.CellHeader>
      <GovTable.Cell>
        <strong>{total}</strong>
      </GovTable.Cell>
    </GovTable.Row>
  </GovTable>
)

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  headers: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  queryParam: PropTypes.string.isRequired,
}

export default Table
