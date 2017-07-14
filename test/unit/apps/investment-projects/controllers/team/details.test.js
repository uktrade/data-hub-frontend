const investmentData = require('~/test/unit/data/investment/investment-data.json')
const controller = require('~/src/apps/investment-projects/controllers/team/details')
const { projectManagementTableLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment team details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextStub = this.sandbox.stub()
    this.breadcrumbStub = function () { return this }
    this.reqStub = this.sandbox.stub()
    this.nextStub = this.sandbox.stub()
    this.controller = proxyquire('~/src/apps/investment-projects/controllers/team/edit-project-management', {
      '../../../../lib/controller-utils': {
        getDataLabels: this.getDataLabelsStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('project management data', () => {
    it('should return null if there is no project manager or assurance adviser', (done) => {
      const data = Object.assign({}, investmentData)
      data.project_manager = null
      data.project_assurance_adviser = null

      controller.getDetailsHandler(this.reqStub, {
        locals: {
          investmentData: data,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template, options) => {
          expect(options.projectManagementData).to.deep.equal(null)
          done()
        },
      }, this.nextStub)
    })

    it('should return formatted data for the project manager and assurance adviser if there are both', (done) => {
      const expectedProjectManagementData = [{
        role: 'Project assuranace adviser',
        adviser: 'John Brown',
        team: 'Team B',
      }, {
        role: 'Project manager',
        adviser: 'Fred Smith',
        team: 'Team A',
      }]

      controller.getDetailsHandler(this.reqStub, {
        locals: {
          investmentData: Object.assign({}, investmentData),
        },
        breadcrumb: this.breadcrumbStub,
        render: (template, options) => {
          expect(options.projectManagementData).to.deep.equal(expectedProjectManagementData)
          done()
        },
      }, this.nextStub)
    })

    it('should return formatted data for project manager, and todo for assurance officer if no assurance officer', (done) => {
      const data = Object.assign({}, investmentData)
      data.project_assurance_adviser = null
      data.project_assurance_team = null

      const expectedProjectManagementData = [{
        role: 'Project assuranace adviser',
        adviser: 'To do',
        team: null,
      }, {
        role: 'Project manager',
        adviser: 'Fred Smith',
        team: 'Team A',
      }]

      controller.getDetailsHandler(this.reqStub, {
        locals: {
          investmentData: data,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template, options) => {
          expect(options.projectManagementData).to.deep.equal(expectedProjectManagementData)
          done()
        },
      }, this.nextStub)
    })

    it('should return formatted data for assurance adviser and todo for project manager is there is no project manager', (done) => {
      const data = Object.assign({}, investmentData)
      data.project_manager = null
      data.project_manager_team = null

      const expectedProjectManagementData = [{
        role: 'Project assuranace adviser',
        adviser: 'John Brown',
        team: 'Team B',
      }, {
        role: 'Project manager',
        adviser: 'To do',
        team: null,
      }]

      controller.getDetailsHandler(this.reqStub, {
        locals: {
          investmentData: data,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template, options) => {
          expect(options.projectManagementData).to.deep.equal(expectedProjectManagementData)
          done()
        },
      }, this.nextStub)
    })
  })

  it('should return labels for the table', (done) => {
    controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: Object.assign({}, investmentData),
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(options.projectManagementTableLabels).to.deep.equal(projectManagementTableLabels)
        done()
      },
    }, this.nextStub)
  })

  it('should use the correct template to render', (done) => {
    controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: Object.assign({}, investmentData),
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(template).to.equal('investment-projects/views/team/details')
        done()
      },
    }, this.nextStub)
  })
})
