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
  margin-bottom: 40px;
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

export const CheckboxPlaceholder = ({ count = 1 }) =>
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
  margin-bottom: 30px;
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

export const InputPlaceholder = ({ count = 1 }) => (
  <InputList>
    {Array.from(Array(count).keys()).map((el, i) => (
      <InputListItem key={i}>
        <InputListItemLabel />
        <InputListItemField />
      </InputListItem>
    ))}
  </InputList>
)

const ToggleHeadingText = styled('div')`
  ${animation};
  width: 250px;
  height: ${SPACING.SCALE_5};
  margin-bottom: ${SPACING.SCALE_4};
`

export const ToggleHeadingPlaceholder = ({ count = 1 }) => (
  <>
    {Array.from(Array(count).keys()).map((el, i) => (
      <ToggleHeadingText key={i} />
    ))}
  </>
)
