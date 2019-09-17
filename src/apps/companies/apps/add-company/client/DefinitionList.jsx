import React from 'react'
import { FONT_SIZE, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import { BLUE, GREY_3 } from 'govuk-colours'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledDLContainer = styled('div')`
  border-top: 2px solid ${GREY_3};
  border-bottom: 2px solid ${GREY_3};
  padding-top: ${SPACING.SCALE_4};
  padding-bottom: ${SPACING.SCALE_4};
  margin-bottom: ${SPACING.SCALE_5};
`

const StyledListHeader = styled('p')`
  color: ${BLUE};
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: bold;
`

const StyledInnerRow = styled('div')`
  padding: ${SPACING.SCALE_1} 0;

  ${MEDIA_QUERIES.TABLET} {
    display: inline-flex;
  }
`

const StyledDL = styled('dl')`
  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    flex-direction: column;
  }
`

const StyledDT = styled('dt')`
  padding-right: ${SPACING.SCALE_4};
  width: 30%;
  font-weight: bold;
`

function Row ({ label, description }) {
  if (!label || !description) {
    return null
  }

  return (
    <StyledInnerRow>
      <StyledDT>{ label }</StyledDT>
      <dd>{ description }</dd>
    </StyledInnerRow>
  )
}

Row.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
}

DefinitionList.defaultProps = {
  label: null,
  description: null,
}

// TODO: Replace this in the near future with SummaryList component and place it in the component library.
function DefinitionList ({ header, children }) {
  return (
    <StyledDLContainer>
      {header && <StyledListHeader>{header}</StyledListHeader>}
      <StyledDL>
        {children}
      </StyledDL>
    </StyledDLContainer>
  )
}

DefinitionList.propTypes = {
  header: PropTypes.string,
  children: PropTypes.node,
}

DefinitionList.defaultProps = {
  header: null,
  children: null,
}

DefinitionList.Row = Row

export default DefinitionList
