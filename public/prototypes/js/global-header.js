new Vue({
  el: '#global-header',
  methods: {
    reset() {
      localStorage.clear()
      window.location.href = '/prototypes/subsidiaries.html'
    },
  },
})
