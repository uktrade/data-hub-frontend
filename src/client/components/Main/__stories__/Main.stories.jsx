import React from 'react'
import { storiesOf } from '@storybook/react'

import Main from 'Main'

storiesOf('Main', module)
  .addParameters({ component: Main })
  .add('Default', () => (
    <Main>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>
    </Main>
  ))
