new Vue({
  el: '#messages',
  methods: {
    getMessage: function () {
      return getQueryParam('success')
    },
    canShow: function () {
      return this.getMessage() !== null
    },
  },
})
