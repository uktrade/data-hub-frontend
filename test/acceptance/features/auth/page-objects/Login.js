module.exports = {
  url: `${process.env.QA_HOST}/sign-in`,
  props: {
    email: process.env.QA_USER_EMAIL,
    password: process.env.QA_USER_PASSWORD,
  },
  elements: {
    pageHeading: 'h1.c-local-header__heading',
    signInForm: '.qa-sign-in-form',
    signOutLink: '.qa-sign-out',
    signInLink: '.qa-sign-in',
    supportLink: '.qa-support',
    flashMessage: '.c-message--success',
    usernameField: '#field-username',
    passwordField: '#field-password',
    searchBar: '#field-term',
    breadcrumbHome: '.c-breadcrumb li:nth-child(1) a',
  },
  commands: [
    {
      enterCredentials () {
        return this.waitForElementVisible('@signInForm')
          .setValue('@usernameField', this.props.email)
          .setValue('@passwordField', this.props.password)
      },

      logIn () {
        return this.enterCredentials()
          .submitForm('@signInForm')
          .waitForElementVisible('@searchBar')
      },

      authenticate () {
        this.api.element('css selector', '#field-username', (result) => {
          if (result.value.ELEMENT) {
            return this.logIn()
          }
          return this.waitForElementVisible('@searchBar')
        })
      },
    },
  ],
}
