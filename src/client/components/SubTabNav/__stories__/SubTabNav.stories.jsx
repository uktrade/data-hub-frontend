import React from 'react'
import { storiesOf } from '@storybook/react'

import SubTabNav from 'SubTabNav'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

storiesOf('SubTabNav', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <SubTabNav
      id="test-sub-tabs"
      label="Tabs for scenario 1"
      tabs={{
        prospect: {
          label: 'Prospect',
          href: '#',
          content: 'Content for prospect tab here',
        },
        active: {
          label: 'Active',
          href: '#',
          content: 'Content for active tab here',
        },
        won: { label: 'Won', href: '#', content: 'Content for won tab here' },
      }}
    />
  ))
  .add('Second tab selected', () => (
    <SubTabNav
      id="test-sub-tabs-2"
      label="Tabs for scenario 2"
      selected="1"
      tabs={[
        {
          label: 'Prospect',
          href: '#',
          content: 'Content for prospect tab here',
        },
        {
          label: 'Active',
          href: '#',
          content: 'Content for active tab here',
        },
        { label: 'Won', href: '#', content: 'Content for won tab here' },
      ]}
    />
  ))
