const tokenMock = '12345abcde'
const companyMock = {
  id: '9999',
  company_number: '10620176',
  companies_house_data: null,
  name: 'ADALEOP LTD',
  registered_address_1: '13 HOWICK PARK AVENUE',
  registered_address_2: 'PENWORTHAM',
  registered_address_town: 'PRESTON',
  registered_address_county: '',
  registered_address_postcode: 'PR1 0LS',
}

describe('Company controller, archive', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.archiveCompanyStub = this.sandbox.stub()
    this.unarchiveCompanyStub = this.sandbox.stub()
    this.errorLoggerSpy = this.sandbox.spy()
    this.redirectSpy = this.sandbox.spy()
    this.flashSpy = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/archive', {
      '../repos': {
        archiveCompany: this.archiveCompanyStub,
        unarchiveCompany: this.unarchiveCompanyStub,
      },
      '../../../../config/logger': {
        error: this.errorLoggerSpy,
      },
    })

    this.reqMock = {
      flash: this.flashSpy,
      session: {
        token: tokenMock,
      },
      body: {},
    }
    this.resMock = {
      redirect: this.redirectSpy,
      locals: {
        company: companyMock,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('archiveCompany()', () => {
    context('when no reason is supplied', () => {
      beforeEach(() => {
        this.controller.archiveCompany(this.reqMock, this.resMock)
      })

      it('should set an error on flash', () => {
        expect(this.flashSpy.args[0][0]).to.equal('error')
        expect(this.flashSpy).to.have.been.calledOnce
      })

      it('should redirect back to company', () => {
        expect(this.redirectSpy).to.have.been.calledWith(`/companies/${companyMock.id}`)
        expect(this.redirectSpy).to.have.been.calledOnce
      })

      it('should not attempt to archive company', () => {
        expect(this.archiveCompanyStub).not.to.have.been.called
      })
    })

    context('when a reason is supplied', () => {
      beforeEach(() => {
        this.reasonMock = 'Archived reason'
        this.reqMock.body.archived_reason = this.reasonMock
      })

      context('when save returns successfully', () => {
        beforeEach(() => {
          this.archiveCompanyStub.resolves(companyMock)
        })

        context('with a default reason', () => {
          beforeEach(async () => {
            await this.controller.archiveCompany(this.reqMock, this.resMock)
          })

          it('should call archive company with correct args', () => {
            expect(this.archiveCompanyStub).to.have.been.calledWith(tokenMock, companyMock.id, this.reasonMock)
            expect(this.archiveCompanyStub).to.have.been.calledOnce
          })

          it('should set a success on flash', () => {
            expect(this.flashSpy.args[0][0]).to.equal('success')
            expect(this.flashSpy).to.have.been.calledOnce
          })

          it('should redirect back to company', () => {
            expect(this.redirectSpy).to.have.been.calledWith(`/companies/${companyMock.id}`)
            expect(this.redirectSpy).to.have.been.calledOnce
          })
        })

        context('with a custom reason', () => {
          beforeEach(async () => {
            this.reasonMock = 'Other'
            this.customReasonMock = 'My custom reason'
            this.reqMock.body.archived_reason = this.reasonMock
            this.reqMock.body.archived_reason_other = this.customReasonMock

            await this.controller.archiveCompany(this.reqMock, this.resMock)
          })

          it('should call archive company with custom reason', () => {
            expect(this.archiveCompanyStub).to.have.been.calledWith(tokenMock, companyMock.id, this.customReasonMock)
            expect(this.archiveCompanyStub).to.have.been.calledOnce
          })
        })
      })

      context('when save rejects with an error', () => {
        beforeEach(async () => {
          this.errorMock = {
            errorCode: 500,
          }
          this.archiveCompanyStub.rejects(this.errorMock)

          await this.controller.archiveCompany(this.reqMock, this.resMock)
        })

        it('should send error to logger', () => {
          expect(this.errorLoggerSpy).to.have.been.calledWith(this.errorMock)
          expect(this.errorLoggerSpy).to.have.been.calledOnce
        })

        it('should set an error on flash', () => {
          expect(this.flashSpy.args[0][0]).to.equal('error')
          expect(this.flashSpy).to.have.been.calledOnce
        })

        it('should redirect back to company', () => {
          expect(this.redirectSpy).to.have.been.calledWith(`/companies/${companyMock.id}`)
          expect(this.redirectSpy).to.have.been.calledOnce
        })
      })
    })
  })

  describe('unarchiveCompany()', () => {
    context('when save returns successfully', () => {
      beforeEach(async () => {
        this.unarchiveCompanyStub.resolves(companyMock)

        await this.controller.unarchiveCompany(this.reqMock, this.resMock)
      })

      it('should call unarchive company with correct args', () => {
        expect(this.unarchiveCompanyStub).to.have.been.calledWith(tokenMock, companyMock.id)
        expect(this.unarchiveCompanyStub).to.have.been.calledOnce
      })

      it('should set a success on flash', () => {
        expect(this.flashSpy.args[0][0]).to.equal('success')
        expect(this.flashSpy).to.have.been.calledOnce
      })

      it('should redirect back to company', () => {
        expect(this.redirectSpy).to.have.been.calledWith(`/companies/${companyMock.id}`)
        expect(this.redirectSpy).to.have.been.calledOnce
      })
    })

    context('when save rejects with an error', () => {
      beforeEach(async () => {
        this.errorMock = {
          errorCode: 500,
        }
        this.unarchiveCompanyStub.rejects(this.errorMock)

        await this.controller.unarchiveCompany(this.reqMock, this.resMock)
      })

      it('should send error to logger', () => {
        expect(this.errorLoggerSpy).to.have.been.calledWith(this.errorMock)
        expect(this.errorLoggerSpy).to.have.been.calledOnce
      })

      it('should set an error on flash', () => {
        expect(this.flashSpy.args[0][0]).to.equal('error')
        expect(this.flashSpy).to.have.been.calledOnce
      })

      it('should redirect back to company', () => {
        expect(this.redirectSpy).to.have.been.calledWith(`/companies/${companyMock.id}`)
        expect(this.redirectSpy).to.have.been.calledOnce
      })
    })
  })
})
