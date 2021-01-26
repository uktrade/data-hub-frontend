const fixSlashes = require('../fix-slashes')
const connect = require('connect')
const expect = require('chai').expect
const request = require('supertest')
const query = require('connect-query')
const fs = require('fs-extra')

describe('remove trailing slash middleware', () => {
  it('removes the trailing slash for a given url', (done) => {
    const app = connect().use(fixSlashes())
    request(app)
      .get('/about/')
      .expect(301)
      .expect('Location', '/about')
      .end(done)
  })

  it('does not redirect the root url because of the trailing slash', (done) => {
    const app = connect().use(fixSlashes())
    request(app).get('/').expect(404).end(done)
  })

  it('does not redirect for directory index files', (done) => {
    fs.mkdirpSync('.tmp/about')
    fs.writeFileSync('.tmp/about/index.html', 'index')
    const app = connect().use(
      fixSlashes({
        root: '.tmp',
      })
    )
    request(app)
      .get('/about/')
      .expect(404)
      .expect((data) => {
        expect(data.req.path).to.equal('/about/')
      })
      .end((err) => {
        fs.removeSync('.tmp')
        done(err)
      })
  })

  it('handles custom directory index file names', (done) => {
    fs.mkdirpSync('.tmp/about')
    fs.writeFileSync('.tmp/about/custom.html', 'index')
    const app = connect().use(
      fixSlashes({
        root: '.tmp',
        index: 'custom.html',
      })
    )
    request(app)
      .get('/about/')
      .expect(404)
      .expect((data) => {
        expect(data.req.path).to.equal('/about/')
      })
      .end((err) => {
        fs.removeSync('.tmp')
        done(err)
      })
  })

  it('ignores the directory index rule', (done) => {
    fs.mkdirpSync('.tmp/about')
    fs.writeFileSync('.tmp/about/index.html', 'index')
    const app = connect().use(
      fixSlashes({
        root: '.tmp',
        directory: false,
      })
    )
    request(app)
      .get('/about/')
      .expect(301)
      .expect('Location', '/about')
      .end((err) => {
        fs.removeSync('.tmp')
        done(err)
      })
  })

  it('redirects directory index to have a trailing slash', (done) => {
    fs.mkdirpSync('.tmp/about')
    fs.writeFileSync('.tmp/about/index.html', 'index')
    const app = connect().use(
      fixSlashes({
        root: '.tmp',
      })
    )
    request(app)
      .get('/about')
      .expect((req) => {
        expect(req.headers.location).to.equal('/about/')
      })
      .expect(301)
      .end((err) => {
        fs.removeSync('.tmp')
        done(err)
      })
  })

  it('preserves the query parameters on redirect', (done) => {
    const app = connect().use(query()).use(fixSlashes())
    request(app)
      .get('/contact/?query=param')
      .expect(301)
      .expect('Location', '/contact?query=param')
      .end(done)
  })

  it('preserves query parameters and slash on subdirectory directory index redirect', (done) => {
    fs.mkdirpSync('.tmp/about')
    fs.writeFileSync('.tmp/about/index.html', 'index')

    const app = connect()
      .use(query())
      .use(
        fixSlashes({
          root: '.tmp',
        })
      )

    request(app)
      .get('/about?query=params')
      .expect((req) => {
        expect(req.headers.location).to.equal('/about/?query=params')
      })
      .expect(301)
      .end((err) => {
        fs.removeSync('.tmp')
        done(err)
      })
  })

  it('overrides the file exists method with a custom method', (done) => {
    fs.mkdirpSync('.tmp')
    fs.writeFileSync('.tmp/test.html', 'test')

    const app = connect().use(
      fixSlashes({
        exists: () => false,
      })
    )

    request(app)
      .get('/.tmp/test.html')
      .expect(404)
      .end((err) => {
        fs.removeSync('.tmp')
        done(err)
      })
  })
})
