const { addClass, removeClass } = require('../lib/element-stuff')
const foreignOwnedCountryWrapper = document.getElementById('foreign-owned-country-wrapper')
const investmentAccountManagerWapper = document.getElementById('investment-account-manager-wrapper')
const foreignOwnedRadio = document.getElementById('foreign-owned-radio')
const investmentTierSelect = document.querySelector('[name="investment_tier"]')
const ownershipRadioContainer = document.getElementById('ownership-options')

const managedOptions = [
  'C - IST managed',
  'C - IST managed - Partner lead',
  'D - LEP managed',
  'D - Post managed'
]

function updateVisibility () {
  if (managedOptions.includes(investmentTierSelect.value)) {
    removeClass(investmentAccountManagerWapper, 'hidden')
  } else {
    addClass(investmentAccountManagerWapper, 'hidden')
  }

  if (!foreignOwnedRadio.checked === true) {
    addClass(foreignOwnedCountryWrapper, 'hidden')
  } else {
    removeClass(foreignOwnedCountryWrapper, 'hidden')
  }
}

// When I change the account magement tier, check if I need to reveal
investmentTierSelect.addEventListener('change', function () {
  updateVisibility()
})

// When I click on an ownership radio button check if i show the country
ownershipRadioContainer.addEventListener('change', function (event) {
  if (event.target.name && event.target.name === 'ownership') {
    updateVisibility()
  }
})

updateVisibility()
