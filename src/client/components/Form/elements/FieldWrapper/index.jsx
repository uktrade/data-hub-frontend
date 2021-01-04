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
    const isIE = props.isIE
    const hasReducedPadding = props.reducedPadding
    const hasHint = !!props.hint

    return `
    ${
      (isReduced || isIE) &&
      `
    background-color: ${GREY_3};
    label {
      font-size: ${BODY_SIZES.S}px;
        + span {
          font-size: ${BODY_SIZES.S}px;
          + div span {
            font-size: ${BODY_SIZES.S}px;
          }
        }
      }
      input {
        border-width: 1px;
      }
    `
    }
    ${hasReducedPadding ? `padding: 8px 8px 3px !important; ` : `padding: 8px`};
    ${hasHint ? `padding-bottom: ${SPACING.SCALE_1};` : `padding-bottom: 8px;`};
    `
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
  font-size: 19px;
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
    padding-left: 8px;
  `}
  ${(props) =>
    props.showBorder &&
    `
    padding: 8px;
    margin-left: -8px;
  `}

  ${(props) =>
    props.bigLegend &&
    `
    margin-bottom: 20px;
    padding-bottom: 0px;
    font-size: 24px;
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

const FieldInner = ({ legend, error, showBorder, children, bigLegend }) =>
  legend ? (
    <StyledFieldset showBorder={showBorder}>
      <StyledLegend
        className="govuk-heading-m"
        error={error}
        showBorder={showBorder}
        bigLegend={bigLegend}
      >
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
  bigLegend,
  hint,
  error,
  showBorder,
  children,
  reduced,
  reducedPadding,
  isIE,
  ...rest
}) => (
  <StyledFormGroup
    id={`field-${name}`}
    reduced={reduced}
    hint={hint}
    reducedPadding={reducedPadding}
    isIE={isIE}
    {...rest}
  >
    <FieldInner
      legend={legend}
      error={error}
      showBorder={showBorder}
      bigLegend={bigLegend}
    >
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
  bigLegend: PropTypes.bool,
  children: PropTypes.node,
}

FieldInner.defaultProps = {
  legend: null,
  error: null,
  showBorder: false,
  bigLegend: false,
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
