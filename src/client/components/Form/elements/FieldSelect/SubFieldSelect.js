import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { GREY_1 } from '../../../../utils/colours'

import FieldSelect from '.'

const PIPE_WIDTH = 3

export default styled(FieldSelect)({
  display: 'flex',
  gap: SPACING.SCALE_3,
  width: 'fit-content',
  paddingLeft: SPACING.SCALE_3,
  '&::before': {
    content: '""',
    boxSizing: 'border-box',
    width: SPACING.SCALE_5,
    alignSelf: 'stretch',
    borderLeft: `${PIPE_WIDTH}px solid ${GREY_1}`,
    borderBottom: `${PIPE_WIDTH}px solid ${GREY_1}`,
    transform: `translate(0, calc(-50% + ${PIPE_WIDTH / 2}px))`,
    clipPath: `inset(calc(50% - ${PIPE_WIDTH / 2}px) 0px 0px 0px)`,
  },
  /*
  We have to compensate for the combined bottom padding and margin (38px) of
  @gvouk-react Select, under which this component will appear. It is a terrible
  solution, but the only other option is to remove the margin and padding from
  FieldSelect, which would require re-styling most of the app.
  */
  marginTop: -parseInt(SPACING.SCALE_3, 0),
})
