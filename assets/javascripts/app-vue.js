/* eslint no-new: 0 */
const Vue = require('vue')

const vueWrappers = Array.from(document.querySelectorAll('.js-vue-wrapper'))

vueWrappers.forEach((wrapper) => {
  new Vue({
    el: wrapper,
  })
})
