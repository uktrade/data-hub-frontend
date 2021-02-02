import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import {
  SPACING,
  FONT_WEIGHTS,
  HEADING_SIZES,
  BODY_SIZES,
} from '@govuk-react/constants'

import { Select } from '../../../client/components'
import Bar from './Bar'
import Table from './Table'

const StyledSelect = styled(Select)`
  font-size: ${BODY_SIZES.XSMALL}px;
  margin-bottom: ${SPACING.SCALE_5};
  span {
    font-size: ${BODY_SIZES.SMALL}px;
  }
  select {
    font-size: ${BODY_SIZES.SMALL}px;
  }
`

const StyledHeader = styled('h3')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const TotalHeader = styled('h3')`
  font-weight: ${FONT_WEIGHTS.bold};
  display: table;
  line-height: 40px;
  margin-bottom: ${SPACING.SCALE_5};
  span {
    font-size: ${HEADING_SIZES.XLARGE}px;
    display: table-cell;
    padding: 0 ${SPACING.SCALE_1} 0 0;

    + span {
      vertical-align: top;
      font-size: ${BODY_SIZES.SMALL}px;
      line-height: 16px;
    }
  }
`

const StyledButton = styled(Button)`
  margin-bottom: ${SPACING.SCALE_3};
`

const Chart = ({
  title,
  subject,
  description,
  accessible = false,
  sortName,
  onChange = () => {},
  sortLabel,
  sortOptions,
  headers,
  data = [],
  name,
  url,
}) => {
  const [isAccessible, setAccessible] = useState(accessible)
  const hasNoData = Boolean(data.length === 0)

  const total = hasNoData
    ? 0
    : data.results.reduce((prev, curr) => {
        return prev + curr.value
      }, 0)

  return (
    <>
      <StyledHeader>{title}</StyledHeader>
      {hasNoData ? (
        <>Data currently unavailable</>
      ) : (
        <>
          <StyledSelect
            name={sortName}
            label={sortLabel}
            input={{
              onChange,
            }}
          >
            {sortOptions &&
              sortOptions.map(({ label, value }, i) => (
                <option value={value} key={i}>
                  {label}
                </option>
              ))}
          </StyledSelect>
          <TotalHeader>
            <span>{total}</span> <span>{subject}</span>
          </TotalHeader>
          {total > 0 && (
            <StyledButton onClick={() => setAccessible(!isAccessible)}>
              {isAccessible
                ? 'Change to chart view'
                : 'Change to accessible view'}
            </StyledButton>
          )}
          {isAccessible || total === 0 ? (
            <Table
              data={data.results}
              headers={headers}
              total={total}
              url={url}
              name={name}
            />
          ) : (
            <Bar
              data={data.results}
              name={name}
              total={total}
              description={description}
              url={url}
            />
          )}
        </>
      )}
    </>
  )
}

Chart.propTypes = {
  title: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sortName: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  sortLabel: PropTypes.string.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  data: PropTypes.shape({
    date: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        param: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        key: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default Chart
