/* eslint no-new: 0 */
import Vue from 'vue'

import SmartMultipleChoice from './components/smart-multiple-choice.vue'

new Vue({
  el: '#main-content',
  components: {
    'smart-multiple-choice': SmartMultipleChoice,
  },
})
