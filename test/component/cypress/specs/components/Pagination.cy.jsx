import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { isString } from 'lodash'

import RoutedPagination from '../../../../../src/client/components/Pagination/RoutedPagination'

const assertPageLinks = (pageLinks) => {
  cy.get('[data-test="pagination"] ul li a').each(($el, index) => {
    cy.wrap($el).should('have.text', pageLinks[index])
  })
}

const assertVisiblePageLinks = (pageLinks) => {
  let visibleCount = 0
  cy.get('[data-test="pagination"] ul li a').each(($el) => {
    if (!$el.is(':hidden')) {
      cy.wrap($el).should('have.text', pageLinks[visibleCount])
      visibleCount++
    }
  })
}

const assertActivePageLink = (pageLink) =>
  isString(pageLink)
    ? cy.focused().should('have.attr', 'data-test', pageLink)
    : cy
        .get(`[data-page-number="${pageLink}"]`)
        .should('have.attr', 'data-test', 'page-number-active')
        .focused()
        .should('have.attr', 'data-test', 'page-number-active')

const assertPageQueryParam = (queryParamValue) =>
  cy.location().should((loc) => loc.search === `?page=${queryParamValue}`)

const Component = (props) => (
  <BrowserRouter>
    <div style={{ height: '1100px' }}>
      <RoutedPagination {...props} />
    </div>
  </BrowserRouter>
)

describe('Pagination', () => {
  context('when on MOBILE and you are on the first page', () => {
    beforeEach(() => {
      cy.mount(<Component items={150} />)
    })
    it('should render a page link', () => {
      assertVisiblePageLinks(['Next page'])
    })
  })
  context('when on MOBILE and you click next', () => {
    beforeEach(() => {
      cy.mount(<Component items={150} />)
      cy.scrollTo(0, 500)
      cy.get('[data-test="pagination"] ul li a').last().click()
    })
    it('should render two page links', () => {
      assertVisiblePageLinks(['Previous page', 'Next page'])
    })
    it('should have an active page link', () => {
      assertActivePageLink('next')
    })
    it('should set page state', () => {
      assertPageQueryParam(2)
    })
    it('should scroll to the top of the window', () => {
      cy.window().its('scrollY').should('equal', 0)
    })
  })
  context('when on MOBILE and you cycle 2 pages and click prev', () => {
    beforeEach(() => {
      cy.mount(<Component items={150} />)
      cy.scrollTo(0, 500)
      cy.get('[data-test="pagination"] ul li a').last().click()
      cy.get('[data-test="pagination"] ul li a').last().click()
      cy.get('[data-test="pagination"] ul li a').first().click()
    })
    it('should render two page links', () => {
      assertVisiblePageLinks(['Previous page', 'Next page'])
    })
    it('should have an active page link', () => {
      assertActivePageLink('previous')
    })
    it('should set page state', () => {
      assertPageQueryParam(2)
    })
    it('should scroll to the top of the window', () => {
      cy.window().its('scrollY').should('equal', 0)
    })
  })
  context('when on MOBILE and you on the last page', () => {
    beforeEach(() => {
      cy.mount(<Component items={150} initialPage={15} />)
    })
    it('should render one page link', () => {
      assertVisiblePageLinks(['Previous page'])
    })
  })
  context('when on MOBILE and you only have one page', () => {
    beforeEach(() => {
      cy.mount(<Component items={1} />)
    })
    it('should not render page links', () => {
      cy.get('[data-test="pagination"]').should('not.exist')
    })
  })
  context('when you have more than 10 pages', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={1000} />)
    })
    it('should render page links', () => {
      assertPageLinks([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'Next page',
      ])
    })
    it('should have an active page link', () => {
      assertActivePageLink(1)
    })
  })
  context('when you have less than 10 pages', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={15} />)
    })
    it('should render page links', () => {
      assertPageLinks(['1', '2', 'Next page'])
    })
    it('should have an active page link', () => {
      assertActivePageLink(1)
    })
  })
  context('when you navigate to page 2 by clicking the second link', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={1000} />)
      cy.get('[data-page-number="2"]').click()
    })
    it('should render page links', () => {
      assertPageLinks([
        'Previous page',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'Next page',
      ])
    })
    it('should have an active page link', () => {
      assertActivePageLink(2)
    })
    it('should set page state', () => {
      assertPageQueryParam(2)
    })
    it('should scroll to the top of the window', () => {
      cy.window().its('scrollY').should('equal', 0)
    })
  })
  context('when you navigate to page 2 by clicking the next page link', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={1000} />)
      cy.get('[data-test="pagination"] ul li a').last().click()
    })
    it('should render page links', () => {
      assertPageLinks([
        'Previous page',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'Next page',
      ])
    })
    it('should have an active page link', () => {
      assertActivePageLink(2)
    })
    it('should set page state', () => {
      assertPageQueryParam(2)
    })
    it('should scroll to the top of the window', () => {
      cy.window().its('scrollY').should('equal', 0)
    })
  })
  context(
    'when you navigate back to page 1 by clicking the Previous link',
    () => {
      beforeEach(() => {
        cy.viewport(1000, 1000)
        cy.mount(<Component items={1000} />)
        cy.get('[data-page-number="2"]').click()
        cy.get('[data-test="pagination"] ul li a').first().click()
      })
      it('should render page links', () => {
        assertPageLinks([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          'Next page',
        ])
      })
      it('should have an active page link', () => {
        assertActivePageLink(1)
      })
      it('should set page state', () => {
        assertPageQueryParam(1)
      })
      it('should scroll to the top of the window', () => {
        cy.window().its('scrollY').should('equal', 0)
      })
    }
  )
  context('when you navigate past page 6', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={1000} />)
      cy.get('[data-page-number="7"]').click()
    })
    it('should display the next 10 page links', () => {
      assertPageLinks([
        'Previous page',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        'Next page',
      ])
    })
  })
  context('when you have initial page state', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={1000} initialPage={2} />)
    })
    it('should render page links', () => {
      assertPageLinks([
        'Previous page',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'Next page',
      ])
    })
    it('should have an active page link', () => {
      assertActivePageLink(2)
    })
  })
  context('when you click on the last page', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={100} />)
      cy.get('[data-page-number="10"]').click()
    })
    it('should render page links', () => {
      assertPageLinks([
        'Previous page',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
      ])
    })
  })
  context('when you only have one page to display', () => {
    beforeEach(() => {
      cy.viewport(1000, 1000)
      cy.mount(<Component items={1} />)
    })
    it('should not render page links', () => {
      cy.get('[data-test="pagination"]').should('not.exist')
    })
  })
})
