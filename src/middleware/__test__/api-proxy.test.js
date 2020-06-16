const express = require('express')
const request = require('supertest')

const config = require('../../config')
const apiProxy = require('../../middleware/api-proxy')

describe('API proxy middleware', () => {
  it('should forward requests to the backend', async () => {
    const scope = nock(config.apiRoot)
      .get('/whoami')
      .reply(200, {})

    const app = express()
    app.use((req, res, next) => {
      req.session = { token: '123' }
      next()
    })
    apiProxy(app)

    await request(app)
      .get('/api-proxy/whoami')
      .set({
        'X-B3-TraceId': 'fake-trace-id',
        'X-B3-SpanId': 'fake-span-id',
      })
      .expect(200)

    expect(scope.interceptors[0].req.headers).to.contains({
      authorization: 'Bearer 123',
      'x-b3-spanid': 'fake-span-id',
      'x-b3-traceid': 'fake-trace-id',
    })
  })
})
