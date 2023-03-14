const uid = require('uid-safe').sync

const { redisStore } = require('../session-store')
const redisClient = require('../../lib/redis-client')

const client = redisClient.getClient()

describe('Session middleware', () => {
  it('should store the same session value', async () => {
    const sessionId = uid(24)
    const expectedValue = {
      anArray: ['one', 'two', 'three'],
    }
    await setValue(sessionId, { lastModified: 1, ...expectedValue })
    await setValue(sessionId, { lastModified: 2, ...expectedValue })

    const actual = await getValue(sessionId)

    expect(actual).to.deep.equal({ lastModified: 2, ...expectedValue })
  })

  after(async () => {
    await client.quit()
  })
})

const getValue = (sessionId) =>
  new Promise((resolve, reject) => {
    redisStore.get(sessionId, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })

const setValue = (sessionId, value) =>
  new Promise((resolve, reject) => {
    redisStore.set(sessionId, value, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
