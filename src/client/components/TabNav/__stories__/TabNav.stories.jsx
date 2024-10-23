import React from 'react'

import TabNav from '..'
import usageReadme from './usage.md'

export default {
  title: 'TabNav',
}

export const DocsPlaceholder = () => (
  <p>
    This is a workaround to get the DocsPage to work with multiInstance
    components.
  </p>
)

DocsPlaceholder.story = {
  name: 'Docs placeholder',
}

export const Default = () => (
  <TabNav
    id="asdfasdfsadf"
    label="Example"
    selectedIndex="bar"
    tabs={{
      foo: {
        label: 'Foo',
        content: <h1>Foo</h1>,
      },
      bar: {
        label: 'Bar',
        content: <>Bar</>,
        content: (
          <TabNav
            layout="vertical"
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
                content: (
                  <TabNav
                    id="deeper-nested"
                    label="Deeper nested"
                    selectedIndex="y"
                    tabs={{
                      x: { label: 'X', content: 'X' },
                      y: { label: 'Y', content: 'Y' },
                      z: { label: 'Z', content: 'Z' },
                    }}
                  />
                ),
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
)

Default.story = {
  parameters: {
    docs: {
      storyDescription: usageReadme,
    },
  },
}

export const Routed = () => (
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
)
