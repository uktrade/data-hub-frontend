/* eslint no-new: 0 */
const Facets = require('./facets')

document.addEventListener(
  'DOMContentLoaded',
  function () {
    new Facets(document.getElementById('facets'))
  },
  false
)
