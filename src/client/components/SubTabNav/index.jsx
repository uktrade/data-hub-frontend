import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { WHITE, BLUE, GREY_2 } from 'govuk-colours'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import Link from '@govuk-react/link'

const StyledTabList = styled.ol`
  padding: 0;
  margin: 0 0 2px 0;
  color: ${BLUE};
  background-color: ${WHITE};
  display: flex;
  flex-direction: row;
  flext-wrap: wrap;
  justify-content: center;
  justify-content: space-between;
`
const StyledTabItem = styled.li`
  list-style: none;
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: normal;
  display: inline-block;
  line-height: 2;
`

const StyledTabPanel = styled.div`
  margin: 0;
  padding ${SPACING.SCALE_4} 0 0 0;
  border-top: 1px solid ${GREY_2};
`

const StyledSpan = styled.span`
  border-bottom: 8px solid ${BLUE};
  padding-bottom: ${SPACING.SCALE_1};
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

function createId(id, key) {
  return `sub-nav.${id}.${key}`
}

function SubTabNav({ id, label, selected, tabs, ...rest }) {
  const tabList = Object.entries(tabs)
  const selectedKey = selected || tabList[0][0]
  const panelId = createId(id, selectedKey)
  return (
    <>
      <StyledTabList {...rest} role="tablist" aria-label={label}>
        {tabList.map(([key, { label, href }]) => {
          const isSelected = selectedKey === key
          const tabId = createId(id, key) + '.tab'
          return (
            <StyledTabItem
              role="tab"
              aria-selected={isSelected ? 'true' : 'false'}
              id={tabId}
              key={tabId}
            >
              {isSelected ? (
                <StyledSpan>{label}</StyledSpan>
              ) : (
                <StyledLink href={href}>{label}</StyledLink>
              )}
            </StyledTabItem>
          )
        })}
      </StyledTabList>
      <StyledTabPanel
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`tab.${panelId}`}
        id={panelId}
        key={panelId}
      >
        {tabs[selectedKey]?.content}
      </StyledTabPanel>
    </>
  )
}

const tabPropType = PropTypes.shape({
  label: PropTypes.node.isRequired,
  href: PropTypes.string,
  content: PropTypes.node,
})

SubTabNav.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired, //for the aria-label
  selected: PropTypes.string,
  tabs: PropTypes.oneOfType([
    PropTypes.arrayOf(tabPropType),
    PropTypes.objectOf(tabPropType),
  ]).isRequired,
}

export default SubTabNav
