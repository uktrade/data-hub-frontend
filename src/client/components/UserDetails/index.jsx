import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import { format } from 'date-fns'
import { GREY_1 } from 'govuk-colours'

const StyledPanel = styled('div')`
  padding: ${SPACING.SCALE_4};
  border: 2px solid ${GREY_1};
`
const StyledName = styled('h2')`
  margin-bottom: ${SPACING.SCALE_2};
  text-align: left;
  font-size: ${typography.font({ size: 19, weight: 'bold' })};
`

const StyledBody = styled('div')`
  text-align: left;
  align-self: stretch;
  font-size: ${typography.font({ size: 16 })};
`

const StyledLoggedInDate = styled('div')`
  margin-top: ${SPACING.SCALE_3};
  text-align: left;
  font-size: ${typography.font({ size: 16 })};
`
const UserDetails = ({ name, last_login, dit_team, job_title }) => (
  <StyledPanel>
    <StyledName>{name}</StyledName>
    <StyledBody>{job_title}</StyledBody>
    <StyledBody>{dit_team.name}</StyledBody>
    <StyledBody>{dit_team.country.name}</StyledBody>
    <StyledLoggedInDate>
      Last logged in {format(last_login, 'dddd, DD MMM YYYY HH:mm ')}
    </StyledLoggedInDate>
  </StyledPanel>
)

UserDetails.propTypes = {
  name: PropTypes.string.isRequired,
  last_login: PropTypes.string.isRequired,
  dit_team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    country: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }),
}

export default UserDetails
