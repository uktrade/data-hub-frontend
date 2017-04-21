/* globals sinon: true */
/* eslint camelcase: 0 */

function saveStub () {
  return sinon.spy(function (token, formData) {
    return new Promise((resolve, reject) => {
      if (!formData.id) {
        formData.id = '1234'
      }

      if (formData.id === 'XXX') {
        return reject({
          error: { name: ['test'] }
        })
      }

      if (formData.id === 'YYY') {
        try {
          throw Error('error')
        } catch (error) {
          return reject(error)
        }
      }

      return resolve(formData)
    })
  })
}

function createBlankInteractionForCompanyStub (interaction) {
  const _interaction = interaction || {
    company: {
      id: '4444',
      name: 'Fred ltd.'
    }
  }
  return sinon.spy(function (token, dit_advisor, interaction_type, companyId) {
    return new Promise((resolve, reject) => {
      resolve(_interaction)
    })
  })
}

function createBlankInteractionForContactStub (interaction) {
  const _interaction = interaction || {
    company: {
      id: '4444',
      name: 'Fred ltd.'
    },
    contact: {
      id: '33333',
      name: 'Fred Smith',
      first_name: 'Fred',
      last_name: 'Smith'
    }
  }
  return sinon.spy(function (token, dit_advisor, interaction_type, contactId) {
    return new Promise((resolve, reject) => {
      resolve(_interaction)
    })
  })
}

function getContactsForCompanyStub () {
  return sinon.spy(function () {
    return new Promise((resolve, reject) => {
      resolve([{
        id: '1234',
        first_name: 'Fred',
        last_name: 'Smith'
      }])
    })
  })
}

function getAdvisorStub () {
  return sinon.spy(function () {
    return new Promise((resolve, reject) => {
      resolve({
        id: '1234',
        first_name: 'Fred',
        last_name: 'Smith'
      })
    })
  })
}

function getServiceOffersStub () {
  return sinon.spy(function () {
    return new Promise((resolve) => {
      resolve([{ id: '1234', name: 'test' }])
    })
  })
}

function getDitCompanyStub (company) {
  const _company = company || {
    id: '111',
    name: 'Fred ltd'
  }

  return sinon.spy(function (token, id) {
    return new Promise((resolve, reject) => {
      if (id === 'YYY') {
        throw new Error('Error getting company')
      }
      resolve(_company)
    })
  })
}

function getContactStub (contact) {
  const _contact = contact || {
    id: '9876',
    name: 'Fred Smith',
    first_name: 'Fred',
    last_name: 'Smith'
  }
  return sinon.spy(function (token, id) {
    return new Promise((resolve, reject) => {
      if (id === 'YYY') {
        throw new Error('Error getting contact')
      }
      return resolve(_contact)
    })
  })
}

function getInteractionTypeStub (interactionType) {
  const _interactionType = interactionType || {
    id: '111',
    name: 'Email'
  }
  return sinon.spy(function () {
    return _interactionType
  })
}

function getInteractionStub (interaction) {
  const _interaction = interaction || {
    id: '3321',
    subject: 'Test subject',
    contact: {
      id: '9876',
      name: 'Fred Smith',
      first_name: 'Fred',
      last_name: 'Smith'
    },
    company: {
      id: '111',
      name: 'Fred ltd'
    }
  }

  return sinon.spy(function () {
    return new Promise((resolve, reject) => {
      resolve(_interaction)
    })
  })
}

module.exports = {
  saveStub,
  createBlankInteractionForCompanyStub,
  createBlankInteractionForContactStub,
  getContactsForCompanyStub,
  getAdvisorStub,
  getServiceOffersStub,
  getDitCompanyStub,
  getContactStub,
  getInteractionStub,
  getInteractionTypeStub
}
