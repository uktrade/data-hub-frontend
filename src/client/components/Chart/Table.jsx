import React from 'react'
import PropTypes from 'prop-types'
import { default as GovTable } from '@govuk-react/table'

const Table = ({ data, headers, total }) => (
  <GovTable>
    <GovTable.Row>
      {headers.map((header, i) => (
        <GovTable.CellHeader key={i}>{header}</GovTable.CellHeader>
      ))}
    </GovTable.Row>
    {data.map(({ label, value, link }, i) => (
      <GovTable.Row key={i}>
        <GovTable.Cell>{label}</GovTable.Cell>
        <GovTable.Cell>
          {link ? (
            <a href={link} title={`View ${label}`}>
              {value}
            </a>
          ) : (
            value
          )}
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
      link: PropTypes.string,
    })
  ).isRequired,
  headers: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
}

export default Table
