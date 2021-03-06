const request = require('supertest')
const express = require('express')
const router = require('express').Router()

const fixSlashes = require('../fix-slashes')

describe('remove trailing slash middleware', () => {
  let app

  beforeEach(function () {
    let respond = (req, res) => {
      res.send('done')
    }
    app = express()
    app.use(fixSlashes())
    app.get('/', respond)
    app.get('/about', respond)
    router.get('/page', respond)
    app.use('/directory', router)
  })

  it('leaves unslashed urls alone', (done) => {
    request(app).get('/about').expect(200).end(done)
  })

  it('removes the trailing slash for a given url', (done) => {
    request(app)
      .get('/about/')
      .expect(301)
      .expect('Location', '/about')
      .end(done)
  })

  it('does not redirect the root url because of the trailing slash', (done) => {
    request(app).get('/').expect(200).end(done)
  })

  it('removes the trailing slash for a sub url', (done) => {
    request(app)
      .get('/directory/page/')
      .expect(301)
      .expect('Location', '/directory/page')
      .end(done)
  })

  it('leaves unslashed sub urls alone', (done) => {
    request(app).get('/directory/page').expect(200).end(done)
  })

  it('preserves the query parameters on redirect', (done) => {
    request(app)
      .get('/about/?query=param')
      .expect(301)
      .expect('Location', '/about?query=param')
      .end(done)
  })

  it('does not redirect to another domain', (done) => {
    request(app).get('///github.com/').expect(404).end(done)
  })
})
