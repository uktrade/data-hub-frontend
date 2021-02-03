import React from 'react'
import PropTypes from 'prop-types'
import { default as GovTable } from '@govuk-react/table'

const Table = ({ data, headers, total, url, name }) => (
  <GovTable>
    <GovTable.Row>
      {headers.map((header, i) => (
        <GovTable.CellHeader key={i}>{header}</GovTable.CellHeader>
      ))}
    </GovTable.Row>
    {data.map(({ param, key, value }, i) => (
      <GovTable.Row key={i}>
        <GovTable.Cell>{key}</GovTable.Cell>
        <GovTable.Cell>
          <a href={`${url}?${name}=${param}`} title={`View ${key}`}>
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
      param: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
  headers: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default Table
