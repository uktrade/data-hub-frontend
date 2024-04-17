import React from 'react'
import Label from '@govuk-react/label'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import { LIGHT_GREY } from '../../../utils/colours'
import { FieldCurrency } from '../../../components'
import { StyledHintParagraph } from './styled'
import { isPositiveInteger } from './validators'
import { winTypes } from './constants'
import {
  formatValue,
  getYearFromWinType,
  sumWinTypeYearlyValues,
} from './utils'

const WinTypeContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 56,
  marginBottom: ({ name }) => (name === winTypes.ODI ? 0 : '40px'),
})

const FieldCurrencyContainer = styled('div')({
  display: 'flex',
  gap: 5,
})

const StyledLabel = styled(Label)({
  fontWeight: 'bold',
})

const StyledSpan = styled('span')({
  padding: 10,
  fontWeight: 'bold',
  backgroundColor: LIGHT_GREY,
})

const allWinTypeYearlyValuesAreEmpty = (field, values) => {
  const fieldName = field.slice(0, field.length - 2)
  const allFields = Object.keys(values).filter((key) =>
    key.startsWith(fieldName)
  )
  const allEmptyFields = allFields.filter((key) => values[key] === '')
  return allEmptyFields.length === allFields.length
}

export const Breakdowns = ({ label, name, years = 5, values }) => {
  const year = getYearFromWinType(name, values)
  return (
    <WinTypeContainer data-test={`breakdowns-${name}`} name={name}>
      <StyledLabel data-test="label">{label}</StyledLabel>
      <StyledHintParagraph data-test="hint">
        (round to nearest £)
      </StyledHintParagraph>
      <FieldCurrencyContainer>
        {[...Array(years).keys()].map((index) => (
          <FieldCurrency
            type="text"
            name={`${name}_${index}`}
            key={`${name}_${index}`}
            label={`Year ${index + 1}`}
            boldLabel={true}
            validate={(value, field, { values }) => {
              if (allWinTypeYearlyValuesAreEmpty(field.name, values)) {
                return 'Enter a value for at least one of the years'
              } else if (isEmpty(value)) {
                // An empty field is valid providing the other fields of
                // the same win type have at least 1 yearly value defined.
                return null
              } else if (isPositiveInteger(value)) {
                return null
              } else {
                return 'The value must not contain letters, symbols, be negative or have over 19 digits'
              }
            }}
          />
        ))}
      </FieldCurrencyContainer>
      <StyledSpan data-test="total" name={name}>
        Totalling over {year} {pluralize('year', year)}:{' '}
        {formatValue(sumWinTypeYearlyValues(name, values))}
      </StyledSpan>
    </WinTypeContainer>
  )
}
