import React from 'react'
import styled from 'styled-components'
import { SPACING, FULL_WIDTH } from '@govuk-react/constants'

import { animation, randomNumberMinToMax } from './utils'

const CheckboxHeading = styled('div')`
  ${animation};
  width: 150px;
  height: ${SPACING.SCALE_4};
`
const CheckboxList = styled('ul')`
  margin-bottom: 75px;
`

const CheckboxListItem = styled('li')`
  display: flex;
  margin-top: ${SPACING.SCALE_3};
`
const Checkbox = styled('div')`
  ${animation};
  width: 25px;
  height: 25px;
`

const CheckboxLabel = styled('div')`
  ${animation};
  align-self: center;
  width: ${randomNumberMinToMax(50, 90)}%;
  height: ${SPACING.SCALE_4};
  margin-left: ${SPACING.SCALE_2};
`

const FilterCheckboxes = ({ count }) =>
  count ? (
    <>
      <CheckboxHeading />
      <CheckboxList>
        {Array(count)
          .fill()
          .map((el, i) => (
            <CheckboxListItem key={i}>
              <Checkbox />
              <CheckboxLabel />
            </CheckboxListItem>
          ))}
      </CheckboxList>
    </>
  ) : null

const InputList = styled('ul')`
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}px;`};
`

const InputListItem = styled('li')`
  &:first-child {
    margin-top: 50px;
  }
  &:only-child {
    margin-top: 0;
  }
`

const InputListItemLabel = styled('div')`
  ${animation};
  width: 150px;
  height: ${SPACING.SCALE_4};
`

const InputListItemField = styled('div')`
  ${animation};
  width: ${FULL_WIDTH};
  height: 35px;
  margin-top: ${SPACING.SCALE_1};
`

const FilterInputs = ({ inputCount }) => (
  <InputList>
    {Array.from(Array(inputCount).keys()).map((el, i) => (
      <InputListItem key={i}>
        <InputListItemLabel />
        <InputListItemField />
      </InputListItem>
    ))}
  </InputList>
)

const collectionListFilters =
  ({ filterCheckboxCount = 6, filterInputCount = 10 } = {}) =>
  () =>
    (
      <>
        <FilterCheckboxes count={filterCheckboxCount} />
        <FilterInputs inputCount={filterInputCount} />
      </>
    )

export default collectionListFilters
