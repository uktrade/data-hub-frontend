var React = require('react')
var { Simulate, act } = require('react-dom/test-utils')
var ReactDOM = require('react-dom')
const { expect } = require('chai')

require('./bootstrap.js')

const SomeJSX = (props) => <button onClick={props.onClick}></button>

describe('SomeJSX', () => {
  it('should be clickable', (done) => {
    var a = 0

    const container = document.createElement('div')
    document.body.appendChild(container)
    act(() => {
      ReactDOM.render(<SomeJSX onClick={() => (a = a + 1)} />, container)
      expect(a).to.equal(0)
    })

    var button = container.querySelector('button')

    act(() => {
      Simulate.click(button)
      expect(a).to.equal(1)
      done()
    })
  })
})
