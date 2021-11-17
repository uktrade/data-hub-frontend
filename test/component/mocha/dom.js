const { JSDOM } = require('jsdom')

var { document } = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
}).window

var win = document.defaultView

global.document = document
global.window = document.defaultView

propagateToGlobal(win)

function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}
