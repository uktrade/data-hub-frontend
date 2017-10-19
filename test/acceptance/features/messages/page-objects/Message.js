module.exports = {
  elements: {
    flashMessage: '.c-message-list li:first-child',
  },

  commands: [
    {
      verifySuccessMessage () {
        return this
          .waitForElementPresent('@flashMessage')
          .assert.cssClassPresent('@flashMessage', 'c-message--success')
      },
    },
  ],
}
