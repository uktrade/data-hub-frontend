/* eslint no-new: 0 */
const Vue = require('vue')

// const Typeahead = require('./vue/typeahead.vue').default
const { highlight } = require('./vue/filters')

Vue.filter('highlight', highlight)

// const vueWrappers = Array.from(document.querySelectorAll('.js-vue-wrapper'))
const noScriptTags = Array.from(document.getElementsByTagName('noscript'))

noScriptTags.forEach((tag) => {
  tag.parentNode.removeChild(tag)
})

// vueWrappers.forEach((wrapper) => {
//   new Vue({
//     el: wrapper,
//     components: {
//       typeahead: Typeahead,
//     },
//   })
// })
