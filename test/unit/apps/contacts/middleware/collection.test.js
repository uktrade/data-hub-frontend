describe('Contact collection middleware', () => {
  beforeEach(() => {
    this.middleware = require('~/src/apps/contacts/middleware/collection')
    this.req = {
      body: '',
      query: {
        name: 'contact name',
        company_name: 'company name',
        company_sector_descends: [
          '9b38cecc-5f95-e211-a939-e4115bead28a',
        ],
        address_country: [
          'af959812-6095-e211-a939-e4115bead28a',
        ],
        company_uk_region: [
          '934cd12a-6095-e211-a939-e4115bead28a',
        ],
      },
    }
    this.res = {}
    this.nextSpy = sinon.spy()
  })

  describe('#getRequestBody', () => {
    context('when supplied with default parameters', () => {
      beforeEach(() => {
        this.req = {
          ...this.req,
          query: {
            ...this.req.query,
            archived: 'false',
          },
        }

        this.middleware.getRequestBody(this.req, this.res, this.nextSpy)
      })

      it('should set the request body', () => {
        expect(this.req.body).to.deep.equal({
          address_country: [
            'af959812-6095-e211-a939-e4115bead28a',
          ],
          archived: 'false',
          company_name: 'company name',
          company_sector_descends: [
            '9b38cecc-5f95-e211-a939-e4115bead28a',
          ],
          company_uk_region: [
            '934cd12a-6095-e211-a939-e4115bead28a',
          ],
          name: 'contact name',
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

        this.middleware.getRequestBody(this.req, this.res, this.nextSpy)
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

        this.middleware.getRequestBody(this.req, this.res, this.nextSpy)
      })

      it('should set sort on the request body', () => {
        expect(this.req.body.sortby).to.equal('modified_on:desc')
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })
    })
  })
})
