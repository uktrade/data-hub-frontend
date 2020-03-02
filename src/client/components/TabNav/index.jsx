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
  selectedIdx,
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
        {tabs.map(({ label }, idx) => (
          <Tabs.Tab
            key={idx}
            onClick={() => onChange(idx)}
            selected={idx === selectedIdx}
          >
            {label}
          </Tabs.Tab>
        ))}
      </StyledTabsList>
    </Tabs>
    {tabs[selectedIdx]?.content}
  </div>
)

TabNav.propTypes = {
  title: PropTypes.string.isRequired,
  selectedIdx: PropTypes.number,
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
    onChange: (selectedIdx) =>
      dispatch({
        type: TAB_NAV__SELECT,
        selectedIdx,
      }),
  }),
  component: TabNav,
  reducer,
})
