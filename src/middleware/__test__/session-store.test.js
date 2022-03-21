const { redisStore } = require('../session-store')
const uid = require('uid-safe').sync

describe('Session middleware', () => {
  it('', () => {
    const sessionId = uid(24)
    redisStore.set(sessionId, {
      anArray: ['one', 'two', 'three'],
    })

    const sessionRead1 = redisStore.get(sessionId)

    redisStore.set(sessionId, sessionRead1)

    const sessionRead2 = redisStore.get(sessionId)

    expect(sessionRead2).to.deep.equal({
      anArray: ['one', 'two', 'three'],
    })
  })
})
