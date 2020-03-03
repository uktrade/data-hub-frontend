import PropTypes from 'prop-types'
import React from 'react'
import { Tabs } from 'govuk-react'
import styled from 'styled-components'

import multiInstance from '../../utils/multiinstance'
import { TAB_NAV__SELECT } from '../../actions'
import reducer from './reducer'

const StyledTabsList = styled(Tabs.List)({
  a: {
    cursor: 'pointer',
  },
})

const TabNav = ({
  selectedIndex,
  onChange,
  tabs = [],
  title,
  // We are only destructuring dispatch from the props so that <div> won't
  // complain about it being an unexpected prop.
  dispatch,
  ...props
}) => (
  <div {...props}>
    <Tabs>
      <Tabs.Title>{title}</Tabs.Title>
      <StyledTabsList>
        {tabs.map(({ label }, index) => (
          <Tabs.Tab
            key={index}
            onClick={() => onChange(index)}
            selected={index === selectedIndex}
          >
            {label}
          </Tabs.Tab>
        ))}
      </StyledTabsList>
    </Tabs>
    {tabs[selectedIndex]?.content}
  </div>
)

TabNav.propTypes = {
  title: PropTypes.string.isRequired,
  selectedIndex: PropTypes.number,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.number,
      ]),
    })
  ),
}

export default multiInstance({
  name: 'TabNav',
  dispatchToProps: (dispatch) => ({
    onChange: (selectedIndex) =>
      dispatch({
        type: TAB_NAV__SELECT,
        selectedIndex,
      }),
  }),
  component: TabNav,
  reducer,
})
