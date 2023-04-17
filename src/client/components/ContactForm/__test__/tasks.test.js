import { redirectToContactForm } from '../tasks'

describe('redirectToContactForm', () => {
  context('when the redirectToContactForm task is called', () => {
    const sessionStorageMock = {}
    before(() => {
      global.window = {
        sessionStorage: {
          getItem: function (key) {
            return sessionStorageMock[key]
          },
          setItem: function (key, values) {
            sessionStorageMock[key] = values
          },
        },
        location: { href: '' },
      }

      redirectToContactForm({
        values: { a: 1, b: '2' },
        url: '/home',
        storeId: 'key',
      })
    })

    it('should save the values into the session storage', () => {
      expect(global.window.sessionStorage.getItem('key')).to.equal(
        JSON.stringify({
          a: 1,
          b: '2',
        })
      )
    })

    it('should change the window url to the url in the payload', () => {
      expect(global.window.location.href).to.equal('/home')
    })
  })
})
