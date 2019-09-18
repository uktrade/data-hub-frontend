import React from 'react'
import { H3, UnorderedList, ListItem } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledUnorderedList = styled(UnorderedList)`
  list-style-type: disc;
  padding-left: ${SPACING.SCALE_5};
`

const Item = ({ children }) => {
  return (
    <ListItem>{children}</ListItem>
  )
}

Item.propTypes = {
  children: PropTypes.node,
}

const InformationList = ({ heading, description, children }) => {
  return (
    <>
      <H3>{heading}</H3>
      <p>{description}</p>
      <StyledUnorderedList>
        {children}
      </StyledUnorderedList>
    </>
  )
}

InformationList.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
}

InformationList.Item = Item

export default InformationList
