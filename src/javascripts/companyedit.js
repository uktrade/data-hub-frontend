/* eslint no-new: 0 */
require('./lookupaddress')
const radioHide = require('./radiohide')
require('./sectors')

radioHide('trading_address_same_as_registered', 'yes', '#trading-address-wrapper', true)
radioHide('is_headquarters', 'no', '#headquarters-type-wrapper', true)
