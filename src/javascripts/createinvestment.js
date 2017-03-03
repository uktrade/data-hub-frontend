const axios = require('axios')

const trade = require('@uktrade/trade_elements').elementstuff

const clientRelationship = document.querySelector('#amcrm_yes')
const notClientRelationship = document.querySelector('#amcrm_no')
const differentclientrelationship = document.querySelector('#client_relationship_manager-wrapper')

const referralSource = document.querySelector('#amreferralsource_yes')
const notReferralSource = document.querySelector('#amreferralsource_no')

const invReferralAltSourceWrapper = document.querySelector('#referral_source_manager-wrapper')

const referrerDropdown = document.querySelector('#referral_source_main')
const eventWrapper = document.querySelector('#eventbox-wrapper')
const subReferWrapper = document.querySelector('#referral_source_sub-wrapper')

const subReferDropdown = document.querySelector('#referral_source_sub')

const radioFdi = document.querySelector('#radio-fdi')
const fdiDropdownWrapper = document.querySelector('#fdi_type-wrapper')

const radioNonFdi = document.querySelector('#radio-nonfdi')
const nonFdiDropdownWrapper = document.querySelector('#inv-non-fdi-wrapper')

const sectorDropdown = document.querySelector('#sector')
const subSectorDropdown = document.querySelector('#subsector')
const subSectorDropdownWrapper = document.querySelector('#subsector-wrapper')

const createBusinessActivity = document.querySelector('#inv-add-business-activity')
const addBusinessActivity = document.querySelector('#addbusiness-wrapper')

const radioNdaNotSigned = document.querySelector('#ndasigned_no')
const radioCanShareWrapper = document.querySelector('#invsubnda > fieldset')
const radioCanShare = document.querySelector('#inv-nda-unsigned_yes')
const textShareDetailsWrapper = document.querySelector('#anonymous_description-wrapper')
const radioCannotShare = document.querySelector('#inv-nda-unsigned_no')
const textNoShareDetailsWrapper = document.querySelector('#maynotshare-wrapper')

notClientRelationship.addEventListener('click', () => {
  trade.removeClass(differentclientrelationship, 'hidden')
}, true)

clientRelationship.addEventListener('click', () => {
  trade.addClass(differentclientrelationship, 'hidden')
}, true)

notReferralSource.addEventListener('click', () => {
  trade.removeClass(invReferralAltSourceWrapper, 'hidden')
})

referralSource.addEventListener('click', () => {
  trade.addClass(invReferralAltSourceWrapper, 'hidden')
})

createBusinessActivity.addEventListener('click', () => {
  trade.removeClass(addBusinessActivity, 'hidden')
})

referrerDropdown.addEventListener('change', (ev) => referHasSubs(ev.target.value))

function referHasSubs (id) {
  axios.get(`/api/investment/subreferrals/${id}`)
    .then((result) => {
      if (result.data.length > 0) {
        if (result.data[0].subreferral_type !== 'FILL_IN_BOX') {
          subReferDropdown.innerHTML = '<option value="-">Pick a value</option>'
          result.data.forEach((el) => {
            subReferDropdown.innerHTML += `<option value="${el.id}">${el.subreferral_type}</option>`
          })
          trade.removeClass(subReferWrapper, 'hidden')
        } else {
          trade.removeClass(eventWrapper, 'hidden')
        }
      } else {
        trade.addClass(subReferWrapper, 'hidden')
      }
    })
}

radioFdi.addEventListener('click', () => {
  trade.removeClass(fdiDropdownWrapper, 'hidden')
  trade.addClass(nonFdiDropdownWrapper, 'hidden')
})

radioNonFdi.addEventListener('click', () => {
  trade.addClass(fdiDropdownWrapper, 'hidden')
  trade.removeClass(nonFdiDropdownWrapper, 'hidden')
})

sectorDropdown.addEventListener('change', (ev) => sectorHasSubs(ev.target.value))

function sectorHasSubs (id) {
  axios.get(`/api/investment/subsectors/${id}`)
    .then((result) => {
      if (result.data.length > 0) {
        subSectorDropdown.innerHTML = '<option value="-">Pick a value</option>'
        result.data.forEach((el) => {
          subSectorDropdown.innerHTML += `<option value="${el.id}">${el.name}</option>`
        })
        trade.removeClass(subSectorDropdownWrapper, 'hidden')
      } else {
        trade.addClass(subSectorDropdownWrapper, 'hidden')
      }
    })
}

radioNdaNotSigned.addEventListener('click', () => {
  trade.removeClass(radioCanShareWrapper, 'hidden')
})

radioCanShare.addEventListener('click', () => {
  trade.addClass(textNoShareDetailsWrapper, 'hidden')
  trade.removeClass(textShareDetailsWrapper, 'hidden')
})

radioCannotShare.addEventListener('click', () => {
  trade.addClass(textShareDetailsWrapper, 'hidden')
  trade.removeClass(textNoShareDetailsWrapper, 'hidden')
})

