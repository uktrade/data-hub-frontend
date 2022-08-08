import React from 'react'
import { storiesOf } from '@storybook/react'

import TabNav from '..'
import usageReadme from './usage.md'

storiesOf('TabNav', module)
  .add('Docs placeholder', () => (
    <p>
      This is a workaround to get the DocsPage to work with multiInstance
      components.
    </p>
  ))
  .add(
    'Default',
    () => (
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
    ),
    {
      docs: {
        storyDescription: usageReadme,
      },
    }
  )
  .add('Routed', () => (
    <TabNav
      id="routed-example"
      label="RoutedExample"
      selectedIndex="bar"
      routed={true}
      tabs={{
        '/foo': {
          label: 'Foo',
          content: <h1>Foo</h1>,
        },
        '/bar': {
          label: 'Bar',
          content: <h2>Bar</h2>,
        },
        '/baz': {
          label: 'Baz',
          content: <h3>Baz</h3>,
        },
      }}
    />
  ))
