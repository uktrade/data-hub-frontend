new Vue({
  el: '#local-nav',
  methods: {
    appendQueryParam (key) {
      return getQueryParam(key)
    },
  },
})
