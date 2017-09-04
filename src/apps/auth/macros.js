const signInForm = {
  buttonText: 'Sign in',
  children: [
    {
      macroName: 'TextField',
      autofocus: true,
      name: 'username',
      label: 'Email address',
    },
    {
      macroName: 'TextField',
      type: 'password',
      name: 'password',
      label: 'Password',
    },
  ],
}

module.exports = {
  signInForm,
}
