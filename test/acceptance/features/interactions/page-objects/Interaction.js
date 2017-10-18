const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

const getRadioButtonWithText = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//span',
      className: 'c-multiple-choice__label-text',
    },
  )

module.exports = {
  props: {},
  elements: {
    addInteractionButton: getButtonWithText('Add interaction'),
    interactionRadioButton: getRadioButtonWithText('A standard interaction'),
    serviceDeliveryRadioButton: getRadioButtonWithText('A service that you have provided'),
    continueButton: getButtonWithText('Continue'),
  },
  commands: [
  ],
}
