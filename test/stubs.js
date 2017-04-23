/* globals sinon: true */

function saveStub () {
  return sinon.spy(function (token, formData) {
    return new Promise((resolve, reject) => {
      if (!formData.id) {
        formData.id = '1234'
      }
      return resolve(formData)
    })
  })
}

function promiseSaveFieldError () {
  return sinon.stub.rejects({error: { name: ['test'] }})
}

function promiseSaveFailError () {
  return sinon.stub.reject(Error('error'))
}

function transformObjectStub (object) {
  const _object = object || { id: '1234', name: 'Thing' }
  return sinon.stub().returns(_object)
}

function getNetworkObjectStub (object) {
  return getPromisedObjectStub(object)
}

function getPromisedObjectStub (object) {
  const _object = object || { id: '1234', name: 'Thing' }
  return sinon.stub().resolves(_object)
}

module.exports = {
  saveStub,
  transformObjectStub,
  getNetworkObjectStub,
  getPromisedObjectStub,
  promiseSaveFailError,
  promiseSaveFieldError
}
