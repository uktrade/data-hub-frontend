import React from 'react'
import Label from '@govuk-react/label'
import pluralize from 'pluralize'
import styled from 'styled-components'

import { LIGHT_GREY } from '../../../../client/utils/colours'
import { FieldCurrency } from '../../../components'
import { StyledHintParagraph } from './styled'
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

export const WinTypeValues = ({ label, name, years = 5, values }) => {
  const year = getYearFromWinType(name, values)
  return (
    <WinTypeContainer>
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
