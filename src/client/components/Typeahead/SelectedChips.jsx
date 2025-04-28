import React from 'react'
import styled from 'styled-components'
import { FOCUSABLE, SPACING } from '@govuk-react/constants'

import { TEXT_COLOUR, GREY_3 } from '../../../client/utils/colours'

const ChipList = styled('ul')({
  listStyleType: 'none',
  margin: `${SPACING.SCALE_1} 0`,
  padding: 0,
})

const Chip = styled('li')({
  display: 'inline-block',
  margin: `${SPACING.SCALE_1} 0`,
})

const ChipButton = styled('button')(FOCUSABLE, {
  backgroundColor: GREY_3,
  border: 'none',
  borderRadius: 3,
  color: TEXT_COLOUR,
  fontSize: '0.75em',
  fontWeight: 'bold',
  marginBottom: 0,
  marginRight: 6,
  padding: `${SPACING.SCALE_1} 1.75em ${SPACING.SCALE_1} ${SPACING.SCALE_1}`,
  position: 'relative',
  cursor: 'pointer',

  '&::before, &::after': {
    borderRight: `1px solid ${TEXT_COLOUR}`,
    content: '""',
    height: '1em',
    right: '0.75em',
    position: 'absolute',
    top: '50%',
    width: 0,
  },

  '&::before': {
    transform: 'translate(0, -50%) rotate(45deg)',
  },

  '&::after': {
    transform: 'translate(0, -50%) rotate(-45deg)',
  },
})

const SelectedChips = ({ name, label, selectedOptions, onOptionRemove }) => (
  <ChipList id={`${name}-selected`} data-test="typeahead-chip-list">
    <span id={`${name}-remove`} style={{ display: 'none' }}>
      remove
    </span>
    {selectedOptions.map((option) => (
      <Chip key={option.value} data-test="typeahead-chip">
        <ChipButton
          type="button"
          aria-label={`${option.chipLabel || option.label} from ${label}`}
          onClick={() => {
            onOptionRemove(option)
          }}
        >
          {option.chipLabel || option.label}
        </ChipButton>
      </Chip>
    ))}
  </ChipList>
)

export default SelectedChips
