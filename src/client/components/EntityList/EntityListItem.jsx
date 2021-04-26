import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import {
  FOCUSABLE,
  FONT_SIZE,
  MEDIA_QUERIES,
  SPACING,
} from '@govuk-react/constants'
import { GREY_2, GREY_4, LINK_COLOUR, LINK_HOVER_COLOUR } from 'govuk-colours'
import { H3 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'

import Metadata from '../../components/Metadata/'

const KEY_ENTER = 13

const StyledEntity = styled('div')`
  margin-bottom: ${SPACING.SCALE_2};
  padding: ${SPACING.SCALE_2};
  border: 1px solid ${GREY_2};
  ${FOCUSABLE};

  &[role='button'] {
    cursor: pointer;

    h3 {
      color: ${LINK_COLOUR};
    }

    &:hover {
      border: 1px solid ${LINK_HOVER_COLOUR};
      background-color: ${GREY_4};

      & > h3 {
        color: ${LINK_HOVER_COLOUR};
      }
    }
  }
`

const StyledHeading = styled(H3)`
  font-size: ${FONT_SIZE.SIZE_16};
  margin: 0 0 ${SPACING.SCALE_2};
  ${MEDIA_QUERIES.TABLET} {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

const StyledInsetText = styled(InsetText)`
  & {
    margin-top: ${SPACING.SCALE_2};
  }
`

const EntityListItem = ({ id, onEntityClick, data, text, heading, meta }) => {
  const isClickable = !!onEntityClick
  return (
    <StyledEntity
      key={`entity_${id}`}
      tabIndex={isClickable && 0}
      role={isClickable && 'button'}
      onClick={() => isClickable && onEntityClick(data)}
      onKeyDown={(e) =>
        isClickable && e.keyCode === KEY_ENTER && onEntityClick(data)
      }
    >
      {heading && <StyledHeading>{heading}</StyledHeading>}

      {!isEmpty(meta) && <Metadata rows={meta} />}

      {text && <StyledInsetText>{text}</StyledInsetText>}
    </StyledEntity>
  )
}

EntityListItem.propTypes = {
  id: PropTypes.string.isRequired,
  onEntityClick: PropTypes.func,
  data: PropTypes.shape({}),
  text: PropTypes.node,
  heading: PropTypes.string,
  meta: PropTypes.array,
}

EntityListItem.defaultProps = {
  text: null,
  onEntityClick: null,
  data: {},
  heading: null,
  meta: [],
}

export default EntityListItem
