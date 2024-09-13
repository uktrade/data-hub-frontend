import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import { state2props } from './state'
import {
  LATEST_ANNOUNCEMENT__WRITE_TO_LOCALSTORAGE,
  LATEST_ANNOUNCEMENT__READ_FROM_LOCALSTORAGE,
} from '../../actions'
import { MID_BLUE, WHITE } from '../../utils/colours'

const Container = styled('div')`
  color: ${WHITE};
  background-color: ${MID_BLUE};
  padding: 10px 0 10px 0;
`

const StyledTextLink = styled('a')`
  color: ${WHITE};
  margin-left: ${SPACING.SCALE_1};
  &:visited,
  &:hover,
  &:active {
    color: ${WHITE};
  }
`

const StyledDismissTextLink = styled('button')`
  color: ${WHITE};
  margin-left: ${SPACING.SCALE_5};
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
  announcementLink,
}) => {
  useEffect(() => {
    readFromLocalStorage()
  }, [])
  const [latestAnnouncement] = items
  if (!latestAnnouncement) {
    return null
  }

  const updateLocalStorage = () => {
    writeToLocalStorage(latestAnnouncement.link)
  }

  return announcementLink !== latestAnnouncement.link ? (
    <Container data-testid="feed-banner">
      Update:
      <StyledTextLink href={latestAnnouncement.link}>
        {latestAnnouncement.heading}
      </StyledTextLink>
      <StyledDismissTextLink onClick={updateLocalStorage}>
        Dismiss
      </StyledDismissTextLink>
    </Container>
  ) : null
}

Banner.propTypes = {
  announcementLink: PropTypes.string,
  writeToLocalStorage: PropTypes.func,
  readFromLocalStorage: PropTypes.func,
}

export default connect(state2props, (dispatch) => ({
  writeToLocalStorage: (announcementLink) => {
    dispatch({
      type: LATEST_ANNOUNCEMENT__WRITE_TO_LOCALSTORAGE,
      announcementLink,
    })
  },
  readFromLocalStorage: () => {
    dispatch({
      type: LATEST_ANNOUNCEMENT__READ_FROM_LOCALSTORAGE,
    })
  },
}))(Banner)
