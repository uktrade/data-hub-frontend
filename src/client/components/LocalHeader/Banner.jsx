import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import { WHITE } from 'govuk-colours'

import { state2props } from './state'
import {
  BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE,
  BANNER_DISMISSED__READ_FROM_LOCALSTORAGE,
} from '../../actions'
import { MID_BLUE } from '../../../client/utils/colors'

const StyledBody = styled('div')`
  background-color: ${MID_BLUE};
  color: ${WHITE};
  ${MEDIA_QUERIES.TABLET} {
    height: 40px;
  }
  ${MEDIA_QUERIES.DESKTOP} {
    height: 40px;
  }
`

const StyledDiv = styled('div')`
  text-align: center;
  position: relative;
  ${MEDIA_QUERIES.TABLET} {
    padding-top: 1.5%;
  }
  ${MEDIA_QUERIES.DESKTOP} {
    padding-top: 0.8%;
  }
`

const StyledTextLink = styled('a')`
  position: relative;
  color: ${WHITE};
  margin-left: ${SPACING.SCALE_1};
  &:visited,
  &:hover,
  &:active {
    color: ${WHITE};
  }
`

const StyledDismissTextLink = styled('button')`
  position: relative;
  color: ${WHITE};
  margin-left: ${SPACING.SCALE_1};
  background: none;
  border: none;
  padding: 0;
  font-family: arial, sans-serif;
  text-decoration: underline;
  cursor: pointer;
`

const Banner = ({
  items,
  writeToLocalStorage,
  readFromLocalStorage,
  bannerHeading,
  isBannerDismissed,
}) => {
  useEffect(() => {
    readFromLocalStorage()
  }, [])
  let latestAnnouncementLink
  let latestAnnouncementHeading

  if (items.length > 0) {
    latestAnnouncementLink = items[0].link
    latestAnnouncementHeading = items[0].heading
  }

  const updateLocalStorage = () => {
    writeToLocalStorage(latestAnnouncementLink)
  }

  if (items.length > 0 && bannerHeading == latestAnnouncementLink) {
    return null
  }

  return items.length > 0 && !isBannerDismissed ? (
    <StyledBody>
      <StyledDiv data-testid="feed-banner">
        Update:
        <StyledTextLink href={latestAnnouncementLink}>
          {latestAnnouncementHeading}
        </StyledTextLink>
        <StyledDismissTextLink onClick={updateLocalStorage}>
          Dismiss
        </StyledDismissTextLink>
      </StyledDiv>
    </StyledBody>
  ) : null
}

Banner.propTypes = {
  bannerHeading: PropTypes.string,
  writeToLocalStorage: PropTypes.func,
  readFromLocalStorage: PropTypes.func,
}

export default connect(state2props, (dispatch) => ({
  writeToLocalStorage: (bannerHeading) => {
    dispatch({
      type: BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE,
      bannerHeading,
    })
  },
  readFromLocalStorage: () => {
    dispatch({
      type: BANNER_DISMISSED__READ_FROM_LOCALSTORAGE,
    })
  },
}))(Banner)
