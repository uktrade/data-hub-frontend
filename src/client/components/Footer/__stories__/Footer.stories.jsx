import React from 'react'

import Component from '../index'
import usageReadme from './usage.md'

export default {
  component: Component,
  title: 'Footer',
  parameters: {
    readme: {
      sidebar: usageReadme,
    },
  },
}
export const Footer = () => <Component />
