import React, { useState } from 'react'

import WatchTextContent from '../../../../src/client/components/WatchTextContent.jsx'

const Counter = ({ children }) => {
  const [count, setCount] = useState(0)
  return (
    <>
      <button className="counter" onClick={() => setCount((x) => x + 1)}>
        increase
      </button>
      {children(count)}
    </>
  )
}

describe('WatchTextContent', () => {
  it("calls onTextContentChange when it's text content changes", () => {
    const onTextContentChange = cy.stub()

    cy.mount(
      <Counter>
        {(count) => (
          <>
            count: {count}
            <WatchTextContent onTextContentChange={onTextContentChange}>
              <h1>Heading</h1>
              <ul>
                <li>foo</li>
                <li>bar</li>
                <li>{count}</li>
                <li>baz</li>
              </ul>
            </WatchTextContent>
          </>
        )}
      </Counter>
    )

    cy.get('.counter').click()
    cy.get('.counter').click()
    cy.get('.counter')
      .click()
      .then(() => {
        expect(onTextContentChange.args).to.deep.eq([
          ['Headingfoobar0baz'],
          ['Headingfoobar1baz'],
          ['Headingfoobar2baz'],
          ['Headingfoobar3baz'],
        ])
      })
  })
})
