import React from 'react'
import Badge from 'client/components/Badge'
import { act } from 'react-dom/test-utils'
import { expect } from 'chai'
import ReactDOM from 'react-dom'
import './bootstrap'

const mount = (component) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  act(() => {
    ReactDOM.render(component, container)
  })
  return container
}

describe('Badge', () => {
  const badgeText = 'example'

  context('When no props are passed', () => {
    let container
    beforeEach(() => {
      container = mount(<Badge>{badgeText}</Badge>)
    })

    it('should set the content with children', () => {
      const badge = container.querySelector('[data-test="badge"]')
      expect(badge.textContent).to.equal('example')
    })

    it('should render with a default border', () => {
      const badge = container.querySelector('[data-test="badge"]')
      const styles = window.getComputedStyle(badge)
      expect(styles.border).to.equal('2px solid #bfc1c3')
    })
  })

  context('When a "label" prop is passed passed', () => {
    let container
    beforeEach(() => {
      container = mount(
        <Badge borderColour="red" label="testLabel">
          {badgeText}
        </Badge>
      )
    })

    it('should set the content with children', () => {
      const badge = container.querySelector('[data-test="badge"]')
      expect(badge.textContent).to.equal('testLabelexample')
    })

    it('should render with a red border', () => {
      const badge = container.querySelector('[data-test="badge"]')
      const styles = window.getComputedStyle(badge)
      expect(styles.border).to.equal('2px solid red')
    })
  })
})
