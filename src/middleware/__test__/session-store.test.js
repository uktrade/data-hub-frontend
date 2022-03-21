const { redisStore } = require('../session-store')
const uid = require('uid-safe').sync

describe('Session middleware', (done) => {
  it('should store the same session value', () => {
    const sessionId = uid(24)
    redisStore.set(sessionId, {
      anArray: ['one', 'two', 'three'],
    })

    redisStore.get(sessionId, (data) => {
      expect(data).to.deep.equal({
        anArray: ['one', 'two', 'three'],
      })
    })

    redisStore.get(sessionId, (data) => {
      expect(data).to.deep.equal({
        anArray: ['one', 'two', 'three'],
      })
      done()
    })
  })
})
