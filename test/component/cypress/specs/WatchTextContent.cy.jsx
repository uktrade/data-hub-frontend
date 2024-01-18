import React, { useState } from 'react'

import WatchTextContent from '../../../../src/client/components/WatchTextContent.jsx'

const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <button className="counter" onClick={() => setCount((x) => x + 1)}>
      {count}
    </button>
  )
}

describe('WatchTextContent', () => {
  it("calls onTextContentChange when it's text content changes", () => {
    const onTextContentChange = cy.stub()

    cy.mount(
      <WatchTextContent onTextContentChange={onTextContentChange}>
        <h1>Heading</h1>
        <ul>
          <li>foo</li>
          <li>bar</li>
          <li>
            <Counter />
          </li>
          <li>baz</li>
        </ul>
      </WatchTextContent>
    )

    cy.get('.counter').click()
    cy.get('.counter').click()
    cy.get('.counter')
      .click()
      .then(() => {
        expect(onTextContentChange.args).to.deep.eq([
          ['Headingfoobar1baz'],
          ['Headingfoobar2baz'],
          ['Headingfoobar3baz'],
        ])
      })
  })
})
