import PropTypes from 'prop-types'
import React from 'react'
import { SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import { stylesheet } from 'typestyle'

const inlineLabelCss = stylesheet({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  text: {
    marginRight: SPACING.SCALE_2,
  },
})

// TODO: Move to data-hub-components
const InlineLabel = ({ text, children }) =>
  <Label className={inlineLabelCss.root}>
    <LabelText className={inlineLabelCss.text}>
      {text}
    </LabelText>
    {children}
  </Label>

InlineLabel.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default InlineLabel
