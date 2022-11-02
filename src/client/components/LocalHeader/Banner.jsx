import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { state2props } from './state'

import PropTypes from 'prop-types'

import styled from 'styled-components'
import { WHITE } from 'govuk-colours'

import {
  BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE,
  BANNER_DISMISSED__READ_FROM_LOCALSTORAGE,
} from '../../actions'

const MEDIUMBLUE = '#003399'

const StyledBody = styled('div')`
  background-color: ${MEDIUMBLUE};
  color: ${WHITE};
  height: 40px;
`

const StyledDiv = styled('div')`
  margin-left: 20%;
  position: relative;
  padding-top: 0.9%;
`

const StyledTextLink = styled('a')`
  position: relative;
  color: ${WHITE};
  margin-left: 5px;
  &:visited,
  &:hover,
  &:active {
    color: ${WHITE};
  }
`

const StyledDismissTextLink = styled('button')`
  position: relative;
  color: ${WHITE};
  margin-left: 3%;
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
}) => {
  useEffect(() => {
    readFromLocalStorage()
  }, [])
  const [showDismissButton, setShowDismissButton] = useState(true)
  let latestAnnouncementLink
  let latestAnnouncementHeading

  if (items.length > 0) {
    latestAnnouncementLink = items[0].link
    latestAnnouncementHeading = items[0].heading
  }

  const updateLocalStorage = () => {
    setShowDismissButton(false)
    writeToLocalStorage(latestAnnouncementLink)
  }

  if (items.length > 0 && bannerHeading == latestAnnouncementLink) {
    return null
  }

  return items.length > 0 && showDismissButton ? (
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
