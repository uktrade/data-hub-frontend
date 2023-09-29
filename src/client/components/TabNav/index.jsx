import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { get } from 'lodash'
import { MEDIA_QUERIES, SPACING_POINTS } from '@govuk-react/constants'

import {
  BLACK,
  GREY_4,
  WHITE,
  LINK_COLOUR,
  TEXT_COLOUR,
  BORDER_COLOUR,
  FOCUS_COLOUR,
} from '../../../client/utils/colours'

import multiInstance from '../../utils/multiinstance'
import { TAB_NAV__SELECT, TAB_NAV__FOCUS } from '../../actions'
import reducer from './reducer'

const LEFT_ARROW_KEY = 37
const RIGHT_ARROW_KEY = 39

const focusStyle = {
  '&:focus': {
    outline: `3px solid ${FOCUS_COLOUR}`,
    background: FOCUS_COLOUR,
    [MEDIA_QUERIES.TABLET]: {
      background: WHITE,
    },
  },
}

const StyledSpan = styled('span')({
  display: 'block',
  '::before': {
    color: `${BLACK}`,
    content: '"\u2014 "',
    paddingRight: `${SPACING_POINTS[1]}px`,
  },
  [MEDIA_QUERIES.TABLET]: {
    display: `inline-block`,
    '::before': {
      display: 'none',
    },
  },
})

const buttonStyle = {
  padding: 0,
  margin: `0 0 ${SPACING_POINTS[2]}px 0`,
  color: LINK_COLOUR,
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  textDecoration: 'underline',
  border: 'none',
  background: 'transparent',
}

const StyledButton = styled('button')({
  ...buttonStyle,
  ...focusStyle,
  [MEDIA_QUERIES.TABLET]: {
    color: TEXT_COLOUR,
    fontSize: 19,
    textDecoration: ({ theme }) =>
      get(theme, 'tabNav.button.textDecoration', 'none'),
    padding: `${SPACING_POINTS[2]}px ${SPACING_POINTS[4]}px`,
    margin: `${SPACING_POINTS[1]}px 0 ${SPACING_POINTS[1]}px`,
    background: GREY_4,
    border: 'none',
    cursor: 'pointer',
  },
})

const StyledSelectedButton = styled('button')({
  ...buttonStyle,
  '&:focus': {
    outline: `3px solid ${FOCUS_COLOUR}`,
    background: FOCUS_COLOUR,
  },
  [MEDIA_QUERIES.TABLET]: {
    fontSize: 19,
    textDecoration: 'none',
    color: ({ theme }) =>
      get(theme, 'tabNav.selectedButton.color', TEXT_COLOUR),
    border: ({ theme }) =>
      get(theme, 'tabNav.selectedButton.border', `1px solid ${BORDER_COLOUR}`),
    borderBottom: 'none',
    background: ({ theme }) =>
      get(theme, 'tabNav.selectedButton.background', WHITE),
    '&:focus': {
      background: ({ theme }) =>
        get(theme, 'tabNav.selectedButton.background', WHITE),
    },
    // The negative margin is here so that it overcasts tabpane's top border
    marginBottom: -1,
    // The 19px include compensation for the 1px negative margin above
    padding: '14px 19px 16px',
  },
})

const StyledTablist = styled.div({
  borderBottom: 'none',
  [MEDIA_QUERIES.TABLET]: {
    borderBottom: ({ theme }) =>
      get(theme, 'tabNav.tabList.borderBottom', `1px solid ${BORDER_COLOUR}`),
    '& > *:not(:last-child)': {
      marginRight: 5,
    },
  },
})

const StyledTabpanel = styled('div')`
  ${({ theme }) =>
    theme.tabNav
      ? `
        border: ${get(theme, 'tabNav.tabPanel.border')};
        padding: ${get(theme, 'tabNav.tabPanel.padding')};
        margin-bottom: ${get(theme, 'tabNav.tabPanel.marginBottom')};
      `
      : `
        margin-top: 15px;
        ${MEDIA_QUERIES.TABLET} {
          margin-top: 30px;
        }
      `}
`

const createId = (id, key, routed) =>
  routed ? `${id}.tab.${key.replace('/', '_')}` : `tab.${key}`

function getContent(tabs, keys, selectedTab) {
  if (keys.includes(selectedTab)) {
    return tabs[selectedTab].content
  }

  for (let key of keys) {
    if (key.length > 1 && selectedTab.startsWith(key)) {
      return tabs[key].content
    }
  }
}

const TabNav = ({
  selectedIndex,
  focusIndex,
  tabs,
  label,
  onChange,
  onTabChange,
  onFocusChange,
  id,
  routed,
  keepQueryParams = false,
}) => {
  const tabKeys = Object.keys(tabs)
  const tablistRef = useRef()

  useEffect(() => {
    tablistRef.current?.querySelectorAll('[role=tab]')[focusIndex]?.focus()
  }, [focusIndex, selectedIndex])

  return (
    <Route>
      {({ location: { pathname, search }, history }) => {
        selectedIndex = routed ? pathname : selectedIndex
        const isSelectedValid = tabKeys.includes(selectedIndex)

        return (
          <>
            <StyledTablist
              tabIndex={-1}
              role="tablist"
              ref={tablistRef}
              data-test="tablist"
              aria-label={label}
              onKeyUp={({ keyCode }) => {
                const totalTabs = tabKeys.length
                const foundIndex = tabKeys.indexOf(selectedIndex?.toString())
                const currentFocusIndex =
                  focusIndex !== undefined
                    ? focusIndex
                    : selectedIndex === undefined || foundIndex === -1
                    ? 0
                    : foundIndex

                if (keyCode === RIGHT_ARROW_KEY) {
                  onFocusChange((currentFocusIndex + 1) % totalTabs)
                }

                if (keyCode === LEFT_ARROW_KEY) {
                  onFocusChange(
                    ((currentFocusIndex < 1 ? totalTabs : currentFocusIndex) -
                      1) %
                      totalTabs
                  )
                }
              }}
            >
              {Object.entries(tabs).map(([key, { label }], index) => {
                const selected = isSelectedValid
                  ? key === selectedIndex
                  : key.length > 1 && selectedIndex.startsWith(key)

                const Button = selected ? StyledSelectedButton : StyledButton
                const tabId = createId(id, key, routed)
                return (
                  <StyledSpan key={tabId} data-test="tab-item">
                    <Button
                      role="tab"
                      aria-selected={selected}
                      id={tabId}
                      tabIndex={
                        // If no tab is selected...
                        selectedIndex === undefined && !index
                          ? // ...only the first tab participates in the tabindex
                            0
                          : // Otherwise, only the selected tab participates in tabindex
                          selected
                          ? 0
                          : -1
                      }
                      onClick={() => {
                        onChange(key, index)
                        onTabChange && onTabChange({ path: key })
                        if (routed && !selected) {
                          const url = keepQueryParams ? `${key}${search}` : key
                          history.push(url)
                        }
                      }}
                    >
                      {label}
                    </Button>
                  </StyledSpan>
                )
              })}
            </StyledTablist>
            <StyledTabpanel
              role="tabpanel"
              tabIndex={-1}
              aria-labelledby={createId(id, selectedIndex, true)}
              data-test="tabpanel"
            >
              {getContent(tabs, tabKeys, selectedIndex)}
            </StyledTabpanel>
          </>
        )
      }}
    </Route>
  )
}

const tabPropType = PropTypes.shape({
  label: PropTypes.node.isRequired,
  content: PropTypes.node,
})

TabNav.propTypes = {
  label: PropTypes.string.isRequired,
  routed: PropTypes.any,
  keepQueryParams: PropTypes.bool,
  onTabChange: PropTypes.func,
  tabs: PropTypes.oneOfType([
    PropTypes.arrayOf(tabPropType),
    PropTypes.objectOf(tabPropType),
  ]).isRequired,
}

export default multiInstance({
  name: 'TabNav',
  actionPattern: 'TAB_NAV__',
  dispatchToProps: (dispatch) => ({
    onChange: (selectedIndex, focusIndex) =>
      dispatch({
        type: TAB_NAV__SELECT,
        selectedIndex,
        focusIndex,
      }),
    onFocusChange: (focusIndex) =>
      dispatch({
        type: TAB_NAV__FOCUS,
        focusIndex,
      }),
  }),
  component: TabNav,
  reducer,
})
