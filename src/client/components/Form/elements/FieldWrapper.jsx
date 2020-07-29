import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from '@govuk-react/form-group'
import Label from '@govuk-react/label'
import styled from 'styled-components'
import HintText from '@govuk-react/hint-text'
import { ERROR_COLOUR, GREY_2, GREY_3 } from 'govuk-colours'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  FONT_WEIGHTS,
  SPACING,
  BODY_SIZES,
} from '@govuk-react/constants'
import Paragraph from '@govuk-react/paragraph'

const StyledFormGroup = styled(FormGroup)`
  ${(props) => {
    const isReduced = props.reduced
    const hasHint = !!props.hint
    return (
      isReduced &&
      `
    background-color: ${GREY_3};
    padding: 8px;
    label {
      ${
        hasHint
          ? `padding-bottom: ${SPACING.SCALE_1}`
          : `padding-bottom: ${SPACING.SCALE_2}`
      };
    }
    label, span {
      font-size: ${BODY_SIZES.S}px;
    }
    input {
      border-width: 1px;
    }
  `
    )
  }}
`

const StyledFieldset = styled('fieldset')`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  ${(props) =>
    props.showBorder &&
    `
    border: 1px solid ${GREY_2};
    padding: ${SPACING.SCALE_3};
  `}
`

const StyledLegend = styled('legend')`
  box-sizing: border-box;
  display: table;
  white-space: normal;
  padding: 0;
  margin: 0;
  padding-bottom: ${SPACING.SCALE_1};
  * {
    margin-bottom: ${SPACING.SCALE_1} !important;
  }
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
  ${(props) =>
    props.showBorder &&
    `
    padding: ${SPACING.SCALE_2};
    margin-left: -${SPACING.SCALE_2};
  `}
`

const StyledLabel = styled(Label)`
  padding-bottom: ${SPACING.SCALE_1};
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledHint = styled(HintText)`
  padding: 0;
  margin: 0;
  padding-bottom: ${SPACING.SCALE_2};
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
    padding-bottom: ${SPACING.SCALE_1};
  `}
`

const FieldInner = ({ legend, error, showBorder, children }) =>
  legend ? (
    <StyledFieldset showBorder={showBorder}>
      <StyledLegend error={error} showBorder={showBorder}>
        {legend}
      </StyledLegend>
      {children}
    </StyledFieldset>
  ) : (
    children
  )

const FieldWrapper = ({
  name,
  label,
  legend,
  hint,
  error,
  showBorder,
  children,
  reduced,
}) => (
  <StyledFormGroup id={`field-${name}`} reduced={reduced} hint={hint}>
    <FieldInner legend={legend} error={error} showBorder={showBorder}>
      {label && (
        <StyledLabel error={error} htmlFor={name}>
          {label}
        </StyledLabel>
      )}
      {hint &&
        (showBorder ? (
          <Paragraph>{hint}</Paragraph>
        ) : (
          <StyledHint error={error}>{hint}</StyledHint>
        ))}
      {children}
    </FieldInner>
  </StyledFormGroup>
)

FieldInner.propTypes = {
  legend: PropTypes.node,
  error: PropTypes.string,
  showBorder: PropTypes.bool,
  children: PropTypes.node,
}

FieldInner.defaultProps = {
  legend: null,
  error: null,
  showBorder: false,
  children: null,
}

FieldWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  error: PropTypes.string,
  showBorder: PropTypes.bool,
  children: PropTypes.node,
}

FieldWrapper.defaultProps = {
  label: null,
  legend: null,
  hint: null,
  error: null,
  showBorder: false,
  children: null,
}

export default FieldWrapper
