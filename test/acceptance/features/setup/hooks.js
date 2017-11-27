const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Before }) => {
  Before(function () {
    this.resetState()
  })
})
