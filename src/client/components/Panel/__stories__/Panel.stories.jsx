import React from 'react'
import { storiesOf } from '@storybook/react'

import Panel from 'Panel'

storiesOf('Panel', module)
  .addParameters({ component: Panel })
  .add('Default', () => (
    <Panel title="How do referrals work?">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </Panel>
  ))
