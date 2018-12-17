describe('Collection middleware', () => {
  beforeEach(() => {
    this.middleware = require('~/src/middleware/collection')
    this.req = {
      body: '',
      query: {
        name: 'name',
        company_name: 'company name',
      },
    }
    this.res = {
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    }
    this.nextSpy = sinon.spy()
  })

  describe('#getRequestBody', () => {
    context('when the query is empty', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {},
        }

        this.middleware.getRequestBody([
          'archived',
          'name',
          'company_name',
        ])(this.req, this.res, this.nextSpy)
      })

      it('should not set the request body', () => {
        expect(this.req.body).to.be.an('object').and.empty
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })

    context('when supplied with default parameters', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
            archived: 'false',
          },
        }

        this.middleware.getRequestBody([
          'archived',
          'name',
          'company_name',
        ])(this.req, this.res, this.nextSpy)
      })

      it('should set the request body', () => {
        expect(this.req.body).to.deep.equal({
          archived: 'false',
          company_name: 'company name',
          name: 'name',
        })
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })

    context('when archived is set twice as true and false', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
            archived: [
              'true',
              'false',
            ],
          },
        }

        this.middleware.getRequestBody([
          'archived',
          'name',
          'company_name',
        ])(this.req, this.res, this.nextSpy)
      })

      it('should not set archived on the request body', () => {
        expect(this.req.body.archived).to.be.undefined
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })

    context('when sort is set', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
            sortby: 'modified_on:desc',
          },
        }

        this.middleware.getRequestBody([
          'archived',
          'name',
          'company_name',
        ])(this.req, this.res, this.nextSpy)
      })

      it('should set sort on the request body', () => {
        expect(this.req.body.sortby).to.equal('modified_on:desc')
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })

    context('when supplied with unknown parameters', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {
            random: 'yes',
          },
        }

        this.middleware.getRequestBody([
          'archived',
          'name',
          'company_name',
        ])(this.req, this.res, this.nextSpy)
      })

      it('should set sort on the request body', () => {
        expect(this.req.body.random).to.be.undefined
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })
  })
})
