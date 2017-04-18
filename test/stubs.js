/* globals sinon: true */

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

function transformObjectStub (object) {
  const _object = object || { id: '1234', name: 'Thing' }

  return sinon.spy(function () {
    return _object
  })
}

function getNetworkObjectStub (object) {
  const _object = object || { id: '1234', name: 'Thing' }

  return sinon.spy(function (token, id) {
    return new Promise((resolve, reject) => {
      if (id === 'YYY') {
        try {
          throw Error('error')
        } catch (error) {
          return reject(error)
        }
      }

      return resolve(_object)
    })
  })
}

function getPromisedObjectStub (object) {
  const _object = object || {
    id: '4444',
    name: 'Fred ltd.'
  }
  return sinon.spy(function () {
    return new Promise((resolve, reject) => {
      resolve(_object)
    })
  })
}

module.exports = {
  saveStub,
  transformObjectStub,
  getNetworkObjectStub,
  getPromisedObjectStub
}
