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

describe.skip('WatchTextContent', () => {
  it('can be unmounted', () => {
    const onTextContentChange = cy.stub()
    cy.mount(
      <>
        First render
        <WatchTextContent onTextContentChange={onTextContentChange}>
          <ul>
            <li>foo</li>
            <li>bar</li>
            <li>baz</li>
          </ul>
        </WatchTextContent>
      </>
    )

    cy.contains('First render').then(() =>
      expect(onTextContentChange.args).to.deep.eq([['foobarbaz']])
    )

    cy.mount(<div>Second render</div>)
    cy.contains('First render').should('not.exist')
    cy.contains('Second render')
  })

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

    cy.contains('Headingfoobar0baz').should('not.exist')
    cy.get('.counter').click()
    cy.contains('Headingfoobar1baz').should('not.exist')
    cy.get('.counter').click()
    cy.contains('Headingfoobar2baz').should('not.exist')
    cy.get('.counter')
      .click()
      .then(() => {
        cy.contains('Headingfoobar3baz').should('not.exist')
        expect(onTextContentChange.args).to.deep.eq([
          ['Headingfoobar0baz'],
          ['Headingfoobar1baz'],
          ['Headingfoobar2baz'],
          ['Headingfoobar3baz'],
        ])
      })
  })
})
