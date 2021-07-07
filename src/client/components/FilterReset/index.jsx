import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'
import { isEmpty } from 'lodash'
import qs from 'qs'

const StyledButtonLink = styled(ButtonLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

import { ButtonLink } from '../../components'

const FilterReset = ({ children, ...props }) => (
  <Route>
    {({ history, location: { pathname, search } }) => {
      const { sortby, page, ...filters } = qs.parse(search.slice(1))
      return (
        !isEmpty(filters) && (
          <StyledButtonLink
            {...props}
            onClick={() => {
              history.push(`${pathname}?page=1`)
            }}
          >
            {children}
          </StyledButtonLink>
        )
      )
    }}
  </Route>
)

FilterReset.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FilterReset
