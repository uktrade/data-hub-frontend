import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from '@govuk-react/form-group'
import Label from '@govuk-react/label'
import styled from 'styled-components'
import HintText from '@govuk-react/hint-text'
import {
  ERROR_COLOUR,
  GREY_2,
  GREY_3,
} from '../../../../../client/utils/colours'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  FONT_WEIGHTS,
  SPACING,
  BODY_SIZES,
} from '@govuk-react/constants'

const StyledFormGroup = styled(FormGroup)`
  ${(props) => {
    const isReduced = props.reduced
    const hasHint = !!props.hint

    return `
    ${
      isReduced &&
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
    padding: 8px;
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

const FieldInner = ({
  legend,
  error,
  showBorder,
  children,
  bigLegend,
  groupId,
}) =>
  legend ? (
    <StyledFieldset showBorder={showBorder}>
      <StyledLegend
        className="govuk-heading-m"
        error={error}
        showBorder={showBorder}
        bigLegend={bigLegend}
        id={groupId}
      >
        {legend}
      </StyledLegend>
      {children}
    </StyledFieldset>
  ) : (
    children
  )

/**
 * A simple wrapper for use in the field components, which applies supporting elements and stylings. The FieldWrapper component caters for the child element within, by providing it with the wrapping elements it needs. In particular, this wrapper looks for passed props such as legends, labels, and hints, and provides the required layout or additional elements.
 *
 * In some design cases, there are pages that contain forms with a single radio or checkbox question. These pages have a requirement for a bigger, 'page-title like' legend. The `bigLegend` prop is a boolean which provides alternative styling to the legend, to make it match the bigger legend requirement.
 */
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
  groupId,
  ...rest
}) => (
  <StyledFormGroup
    id={`field-${name}`}
    data-test={`field-${name}`}
    reduced={reduced}
    hint={hint}
    {...rest}
  >
    {legend ? (
      <FieldInner
        legend={legend}
        error={error}
        showBorder={showBorder}
        bigLegend={bigLegend}
        groupId={groupId}
      >
        {label && (
          <StyledLabel error={error} htmlFor={name}>
            {label}
          </StyledLabel>
        )}
        {hint && (
          <StyledHint data-test="hint-text" error={error}>
            {hint}
          </StyledHint>
        )}
        {children}
      </FieldInner>
    ) : (
      <fieldset>
        <FieldInner
          legend={legend}
          error={error}
          showBorder={showBorder}
          bigLegend={bigLegend}
          groupId={groupId}
        >
          {label && (
            <legend>
              <StyledLabel error={error} htmlFor={name}>
                {label}
              </StyledLabel>
            </legend>
          )}
          {hint && (
            <StyledHint data-test="hint-text" error={error}>
              {hint}
            </StyledHint>
          )}
          {children}
        </FieldInner>
      </fieldset>
    )}
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
  /**
   * Text for name attribute value
   */
  name: PropTypes.string.isRequired,
  /**
   * Text for the label element
   */
  label: PropTypes.node,
  /**
   * Node for legend element
   */
  legend: PropTypes.node,
  /**
   * Boolean for showing a big legend
   */
  bigLegend: PropTypes.bool,
  /**
   * Node for hint element
   */
  hint: PropTypes.node,
  /**
   * Text for error
   */
  error: PropTypes.string,
  /**
   * Boolean for showing borders
   */
  showBorder: PropTypes.bool,
  /**
   * Node for children elements
   */
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
