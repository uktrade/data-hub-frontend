import React from 'react'
import { storiesOf } from '@storybook/react'

import TabNav from '..'
import usageReadme from './usage.md'

storiesOf('TabNav', module)
  .addParameters({
    readme: {
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <TabNav
      id="example"
      label="Example"
      selectedIndex="bar"
      tabs={{
        foo: {
          label: 'Foo',
          content: <h1>Foo</h1>,
        },
        bar: {
          label: 'Bar',
          content: (
            <TabNav
              id="nested"
              label="Nested"
              selectedIndex="bbb"
              tabs={{
                aaa: {
                  label: 'A',
                  content: 'aaaaa',
                },
                bbb: {
                  label: 'B',
                  content: 'bbbbb',
                },
                ccc: {
                  label: 'C',
                  content: 'ccccc',
                },
              }}
            />
          ),
        },
        baz: {
          label: 'Baz',
          content: <h3>Baz</h3>,
        },
      }}
    />
  ))
  .add('Routed', () => (
    <TabNav
      id="routed-example"
      label="RoutedExample"
      selectedIndex="bar"
      routed={true}
      tabs={{
        foo: {
          label: 'Foo',
          content: <h1>Foo</h1>,
        },
        bar: {
          label: 'Bar',
          content: <h2>Bar</h2>,
        },
        baz: {
          label: 'Baz',
          content: <h3>Baz</h3>,
        },
      }}
    />
  ))
