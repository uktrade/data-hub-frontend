import React from 'react'

import Component from '../index'

export default {
  component: Component,
  title: 'Footer',
}
export const Footer = () => <Component />
export const CustomLinks = () => (
  <Component
    links={{
      Foo: '/foo',
      Bar: '/bar',
      Baz: '/baz',
    }}
  />
)
