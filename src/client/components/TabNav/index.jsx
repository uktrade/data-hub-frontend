import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import {
  BLACK,
  GREY_4,
  WHITE,
  BLUE,
  DARK_BLUE_LEGACY,
  TEXT_COLOUR,
  BORDER_COLOUR,
  FOCUS_COLOUR,
} from '../../../client/utils/colours'

import multiInstance from '../../utils/multiinstance'
import { TAB_NAV__SELECT, TAB_NAV__FOCUS } from '../../actions'
import reducer from './reducer'

const LEFT_ARROW_KEY = 37
const RIGHT_ARROW_KEY = 39

const BORDER = `1px solid ${BORDER_COLOUR}`

const focusStyle = {
  '&:focus': {
    outline: `3px solid ${FOCUS_COLOUR}`,
    background: FOCUS_COLOUR,
    [MEDIA_QUERIES.TABLET]: {
      background: WHITE,
    },
  },
}

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
  dispatch,
  ...props
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const tabKeys = Object.keys(tabs)
  const tablistRef = useRef()
  selectedIndex = routed ? location.pathname : selectedIndex
  const isSelectedValid = tabKeys.includes(selectedIndex)

  useEffect(() => {
    tablistRef.current?.querySelectorAll('[role=tab]')[focusIndex]?.focus()
  }, [focusIndex, selectedIndex])

  return (
    <div {...props}>
      <div
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
              ((currentFocusIndex < 1 ? totalTabs : currentFocusIndex) - 1) %
                totalTabs
            )
          }
        }}
      >
        {Object.entries(tabs).map(([key, { label }], index) => {
          const selected = isSelectedValid
            ? key === selectedIndex
            : key.length > 1 && selectedIndex.startsWith(key)

          const tabId = createId(id, key, routed)
          return (
            <button
              key={tabId}
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
                  const url = keepQueryParams ? `${key}${location.search}` : key

                  navigate(url)
                }
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        tabIndex={-1}
        aria-labelledby={createId(id, selectedIndex, true)}
        data-test="tabpanel"
      >
        {getContent(tabs, tabKeys, selectedIndex)}
      </div>
    </div>
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

export const HeadlessTabNav = multiInstance({
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

const SmallScreenTabNav = styled(HeadlessTabNav)({
  // We must use direct child combinators everywhere, otherwise the styles
  // would leak to nested tab navs
  '& > [role="tablist"] > [role="tab"]': {
    ...focusStyle,
    padding: '0px',
    margin: '0px 0px 10px',
    color: BLUE,
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    textDecoration: 'underline',
    border: 'none',
    background: 'transparent',
    display: 'block',
    '&::before': {
      content: '"— "',
      display: 'inline-block',
      textDecoration: 'none',
      color: BLACK,
      marginRight: '1ex',
    },
  },
})

export const HorizontalTabNav = styled(SmallScreenTabNav)({
  display: 'contents',
  '& > [role="tabpanel"]': {
    marginTop: 30,
  },
  '& > [role="tablist"]': {
    [MEDIA_QUERIES.TABLET]: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 5,
      borderBottom: BORDER,
    },
    '& > [role="tab"]': {
      [MEDIA_QUERIES.TABLET]: {
        '&::before': {
          display: 'none',
        },
        color: TEXT_COLOUR,
        fontSize: '19px',
        textDecoration: 'none',
        padding: '10px 20px',
        margin: '5px 0px',
        background: GREY_4,
        border: 'none',
        cursor: 'pointer',

        '&[aria-selected="true"]': {
          fontSize: '19px',
          textDecoration: 'none',
          color: TEXT_COLOUR,
          border: BORDER,
          borderBottom: 'none',
          background: WHITE,
          marginBottom: '-1px',
          padding: '14px 19px 16px',
        },
      },
    },
  },
})

export const VerticalTabNav = styled(SmallScreenTabNav)({
  [MEDIA_QUERIES.TABLET]: {
    display: 'flex',
    alignItems: 'start',
    gap: 30,
    '& > [role="tabpanel"]': {
      [MEDIA_QUERIES.TABLET]: {
        flexGrow: 1,
      },
    },
  },
  '& > [role="tablist"]': {
    [MEDIA_QUERIES.TABLET]: {
      display: 'flex',
      flexDirection: 'column',
      '& > [role="tab"]': {
        [MEDIA_QUERIES.TABLET]: {
          '&::before': {
            display: 'none',
          },
          textAlign: 'left',
          textDecoration: 'none',
          border: 'none',
          background: 'none',
          cursor: 'pointer',

          display: 'block',
          fontSize: '20px',
          padding: '11px 16px',
          color: BLUE,
          '&[aria-selected="true"]': {
            color: WHITE,
            background: DARK_BLUE_LEGACY,
            fontWeight: '600',
          },
        },
      },
    },
  },
})

export const DashboardTabNav = styled(HorizontalTabNav)({
  '& > [role="tabpanel"]': {
    border: `2px solid ${BLUE}`,
    padding: SPACING.SCALE_3,
    margin: 0,
  },
  '& > [role="tablist"]': {
    border: 'none',
    fontWeight: 'bold',
    '& > [role="tab"]': {
      [MEDIA_QUERIES.TABLET]: {
        textDecoration: 'underline',
        '&[aria-selected="true"]': {
          background: BLUE,
          borderColor: BLUE,
          color: WHITE,
        },
      },
    },
  },
})

export default ({
  layout = 'horizontal',
  Component = {
    horizontal: HorizontalTabNav,
    vertical: VerticalTabNav,
  }[layout],
  ...props
}) => <Component {...props} />
