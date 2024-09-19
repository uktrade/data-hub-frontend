import React from 'react'

import Panel from '..'

export default {
  title: 'Panel',

  parameters: {
    component: Panel,
  },
}

export const Default = () => (
  <Panel title="How do referrals work?">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua
    </p>
  </Panel>
)
