import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'
import { isEmpty } from 'lodash'
import qs from 'qs'
import { useNavigate, useLocation } from 'react-router-dom-v5-compat'

const StyledButtonLink = styled(ButtonLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

import { ButtonLink } from '../../components'

const FilterReset = ({ children, ...props }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { sortby, page, ...filters } = qs.parse(location.search.slice(1))

  return (
    <>
      {!isEmpty(filters) ? (
        <StyledButtonLink
          {...props}
          onClick={() => {
            navigate(`${location.pathname}?page=1`)
          }}
        >
          {children}
        </StyledButtonLink>
      ) : null}
    </>
  )
}

FilterReset.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FilterReset
