import styled from 'styled-components'

/**
 * @function InlineIcon
 * @description
 * Allows displaying `@govuk-react/icons` icons inline.
 * @param {Object} props
 * @param {React.ReactNode} props.children - A `@govuk-react/icons` element.
 * @example
 * import { IconImportant } from '@govuk-react/icons'
 *
 * <InlineIcon>
 *   <IconImportant/>
 * </InlineIcon>
 */
const InlineIcon = styled.span`
  height: 2ex;
  width: 2ex;
  vertical-align: -10%;
  display: inline-block;
`

export default InlineIcon
