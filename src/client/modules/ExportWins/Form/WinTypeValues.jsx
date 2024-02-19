import React from 'react'
import Label from '@govuk-react/label'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import { LIGHT_GREY } from '../../../../client/utils/colours'
import { FieldCurrency } from '../../../components'
import { StyledHintParagraph } from './styled'
import { isPositiveInteger } from './validators'
import {
  formatValue,
  getYearFromWinType,
  sumWinTypeYearlyValues,
} from './utils'

const WinTypeContainer = styled('div')({
  marginLeft: 56,
})

const FieldCurrencyContainer = styled('div')({
  display: 'flex',
  gap: 5,
})

const StyledLabel = styled(Label)({
  fontWeight: 'bold',
})

const StyledParagraph = styled('p')({
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

export const WinTypeValues = ({ label, name, years = 5, values }) => {
  const year = getYearFromWinType(name, values)
  return (
    <WinTypeContainer data-test={`win-type-values-${name}`}>
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
                return 'The value must not contain letters, be negative or over 19 digits'
              }
            }}
          />
        ))}
      </FieldCurrencyContainer>
      <StyledParagraph data-test="total">
        Totalling over {year} {pluralize('year', year)}:{' '}
        {formatValue(sumWinTypeYearlyValues(name, values))}
      </StyledParagraph>
    </WinTypeContainer>
  )
}
