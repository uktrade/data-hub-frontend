import React from 'react'

import { SummaryTableHighlight } from '../../../../../src/client/components'

const TableComponent = (props) => (
  <SummaryTableHighlight {...props} data-test="summary-table-highlight" />
)

const HighlightRowComponent = (props) => (
  <SummaryTableHighlight.HighlightRow {...props} />
)

const RowComponent = (props) => <SummaryTableHighlight.Row {...props} />

describe('SummaryTableHighlight', () => {
  context('When given caption', () => {
    beforeEach(() => {
      cy.mount(<TableComponent caption="This is a caption" />)
    })

    it('should render the caption', () => {
      cy.get('[data-test=summary-table-highlight] caption')
        .should('exist')
        .should('have.text', 'This is a caption')
    })
  })

  context('When given actions and caption', () => {
    beforeEach(() => {
      cy.mount(
        <TableComponent
          caption="This is a caption"
          actions={<a href="google.com">This is a link</a>}
        />
      )
    })

    it('should render the action and caption', () => {
      cy.get('[data-test=summary-table-highlight] caption')
        .should('exist')
        .should('have.text', 'This is a captionThis is a link')
    })
  })
})

describe('SummaryTableHighlight.HighlightRow', () => {
  context('When given a heading', () => {
    beforeEach(() => {
      cy.mount(
        <HighlightRowComponent
          data-test="highight-row"
          heading="Highlight row heading"
        />
      )
    })

    it('should render the heading', () => {
      cy.get('[data-test=highight-row] th')
        .should('exist')
        .should('have.text', 'Highlight row heading')
    })
  })

  context('When isHalf prop is given', () => {
    it('should render the field in half column when true', () => {
      cy.mount(
        <HighlightRowComponent
          data-test="highight-row"
          heading="Highlight row heading"
          isHalf={true}
        />
      )
      cy.viewport(1200, 1000)
      cy.get('[data-test=highight-row]')
        .should('exist')
        .should('have.css', 'grid-column', 'span 1')
    })

    it('should render the field in full column when false', () => {
      cy.mount(
        <HighlightRowComponent
          data-test="highight-row"
          heading="Highlight row heading"
          isHalf={false}
        />
      )
      cy.viewport(1200, 1000)
      cy.get('[data-test=highight-row]')
        .should('exist')
        .should('have.css', 'grid-column', '1 / -1')
    })
  })

  context('When hideWhenEmpty prop is given', () => {
    it('should not render when true and children are empty', () => {
      cy.mount(
        <HighlightRowComponent
          data-test="highight-row"
          heading="Highlight row heading"
          hideWhenEmpty={true}
        />
      )
      cy.get('[data-test=highight-row]').should('not.exist')
    })

    it('should render even if true when children given', () => {
      cy.mount(
        <HighlightRowComponent
          data-test="highight-row"
          heading="Highlight row heading"
          hideWhenEmpty={true}
        >
          Child content
        </HighlightRowComponent>
      )
      cy.get('[data-test=highight-row] td')
        .should('exist')
        .should('have.text', 'Child content')
    })
  })
})

describe('SummaryTableHighlight.Row', () => {
  context('When given a heading', () => {
    beforeEach(() => {
      cy.mount(<RowComponent data-test="row" heading="Row heading" />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=row] th')
        .should('exist')
        .should('have.text', 'Row heading')
    })
  })

  context('When hideWhenEmpty prop is given', () => {
    it('should not render when true and children are empty', () => {
      cy.mount(
        <RowComponent
          data-test="row"
          heading="Row heading"
          hideWhenEmpty={true}
        />
      )
      cy.get('[data-test=row]').should('not.exist')
    })

    it('should render even if true when children given', () => {
      cy.mount(
        <RowComponent
          data-test="row"
          heading="Row heading"
          hideWhenEmpty={true}
        >
          Child content
        </RowComponent>
      )
      cy.get('[data-test=row] td')
        .should('exist')
        .should('have.text', 'Child content')
    })
  })

  context('When multiple children given', () => {
    it('should render children in a list when given array', () => {
      cy.mount(
        <RowComponent
          data-test="row"
          heading="Row heading"
          children={['list item 1', 'list item 2', 'list item 3']}
        />
      )
      cy.get('[data-test=row] li')
        .should('exist')
        .should('have.text', 'list item 1list item 2list item 3')
    })

    it('should render children without list when not an array', () => {
      cy.mount(
        <RowComponent
          data-test="row"
          heading="Row heading"
          children={'This is some children'}
        />
      )
      cy.get('[data-test=row] li').should('not.exist')

      cy.get('[data-test=row] td')
        .should('exist')
        .should('have.text', 'This is some children')
    })
  })
})
