const express = require('express')
const request = require('supertest')
const { endsWith } = require('lodash')

describe('#build', () => {
  beforeEach(() => {
    this.breadcrumbSpy = sinon.spy()
    this.redirectSpy = sinon.spy()
    this.setOptionsSpy1 = sinon.stub().callsFake((req, res, next) => { next() })
    this.setOptionsSpy2 = sinon.stub().callsFake((req, res, next) => { next() })
    this.journeyBuilder = require('~/src/modules/form/journey-builder.js')

    this.app = express()
    this.app.set('views', `${process.cwd()}/src/templates`)
    this.app.set('view engine', 'njk')
    this.app.use((req, res, next) => {
      req.baseUrl = '/base'
      res.breadcrumb = this.breadcrumbSpy
      next()
    })
    this.app.engine('njk', (path, options, callback) => {
      callback(null, JSON.stringify({ path, options }))
    })

    this.journey = {
      steps: [
        {
          path: '/step-1',
          middleware: [
            this.setOptionsSpy1,
            this.setOptionsSpy2,
          ],
          type: 'form',
          heading: 'Add something',
          breadcrumbs: [
            { name: 'Add something', url: '/url' },
          ],
          macro: () => { return { children: [] } },
          nextPath: ({ selected }) => {
            const paths = {
              'step-2-value': '/step-2',
              'step-3-value': '/step-3',
            }
            return paths[selected]
          },
        },
      ],
    }
  })

  context('when rendering the view', () => {
    const commonTests = () => {
      it('should render the form template', () => {
        const render = JSON.parse(this.response.res.text)
        expect(endsWith(render.path, 'form.njk')).to.be.true
      })

      it('should render the heading', () => {
        const render = JSON.parse(this.response.res.text)
        expect(render.options.heading).to.equal('Add something')
      })

      it('should render the form', () => {
        const render = JSON.parse(this.response.res.text)
        const expected = {
          children: [],
          errors: { error: 'This field is required' },
        }
        expect(render.options.form).to.deep.equal(expected)
      })

      it('should render the breadcrumbs', () => {
        expect(this.breadcrumbSpy).have.been.calledWith('Add something', '/url')
        expect(this.breadcrumbSpy).to.have.been.calledOnce
      })
    }

    context('when middleware has been specified', () => {
      beforeEach(async () => {
        this.app.use((req, res, next) => {
          res.locals.errors = { error: 'This field is required' }
          next()
        })
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).get('/step-1')
      })

      commonTests()

      it('should call the middleware', () => {
        expect(this.setOptionsSpy1).to.be.calledOnce
        expect(this.setOptionsSpy2).to.be.calledOnce
      })
    })

    context('when middleware has not been specified', () => {
      beforeEach(async () => {
        delete this.journey.steps[0].middleware
        this.app.use((req, res, next) => {
          res.locals.errors = { error: 'This field is required' }
          next()
        })
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).get('/step-1')
      })

      commonTests()
    })
  })

  context('when submitting the form', () => {
    context('when middleware has been specified', () => {
      context('when the value for step 2 has been selected', () => {
        beforeEach(async () => {
          this.app.use((req, res, next) => {
            req.body = { selected: 'step-2-value' }
            next()
          })
          this.app.use(this.journeyBuilder.build(this.journey))

          this.response = await request(this.app).post('/step-1')
        })

        it('should call the middleware', async () => {
          expect(this.setOptionsSpy1).to.be.calledOnce
          expect(this.setOptionsSpy2).to.be.calledOnce
        })

        it('should redirect to step 2', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/step-2')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-2')
        })
      })

      context('when the value for step 3 has been selected', () => {
        beforeEach(async () => {
          this.app.use((req, res, next) => {
            req.body = { selected: 'step-3-value' }
            next()
          })
          this.app.use(this.journeyBuilder.build(this.journey))

          this.response = await request(this.app).post('/step-1')
        })

        it('should call the middleware', async () => {
          expect(this.setOptionsSpy1).to.be.calledOnce
          expect(this.setOptionsSpy2).to.be.calledOnce
        })

        it('should redirect to step 3', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/step-3')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-3')
        })
      })
    })

    context('when middleware has not been specified', () => {
      context('when the value for step 2 has been selected', () => {
        beforeEach(async () => {
          delete this.journey.steps[0].middleware
          this.app.use((req, res, next) => {
            req.body = { selected: 'step-2-value' }
            next()
          })
          this.app.use(this.journeyBuilder.build(this.journey))

          this.response = await request(this.app).post('/step-1')
        })

        it('should redirect to step 2', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/step-2')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-2')
        })
      })
    })

    context('when the next path is a string', () => {
      beforeEach(async () => {
        this.journey.steps[0].nextPath = '/finish'
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).post('/step-1')
      })

      it('should redirect to step 2', () => {
        expect(this.response.statusCode).to.equal(302)
        expect(this.response.headers.location).to.equal('/base/finish')
      })

      it('should not render a template', () => {
        expect(this.response.res.text).to.equal('Found. Redirecting to /base/finish')
      })
    })
  })
})
