module.exports = {
  url: process.env.QA_HOST,
  elements: {
    viewYourProjectPipelineLink: '.proposition-menu__item:nth-child(2)',
    stageFilterProspect: 'label[for=field-stage-1]',
    stageFilterAssignPM: 'label[for=field-stage-2]',
    stageFilterActive: 'label[for=field-stage-3]',
    stageFilterVerifyWin: 'label[for=field-stage-4]',
    stageFilterWon: "label[for='field-stage-5']",
    typeofInvestmentFilterCommitmentToInvest: 'label[for=field-investment_type-1]',
    typeofInvestmentFilterFDI: 'label[for=field-investment_type-2]',
    typeofInvestmentFilterNonFDI: 'label[for=field-investment_type-3]',
    sectorFilter: '#field-sector',
    sectorFilterAdvancedEngineering: '#field-sector option:nth-child(2)',
    datesFromFilter: '#field-estimated_land_date_before',
    datesToFilter: '#field-estimated_land_date_after',
    sortByDropDown: '#field-sortby',
    sortByEstimatedLandDateNearestFirst: '#field-sortby option:nth-child(1)',
    sortByEstimatedLandDateLatestFirst: '#field-sortby option:nth-child(2)',
    sortByProjectName: '#field-sortby option:nth-child(3)',
    sortByStage: '#field-sortby option:nth-child(5)',
    sortByInvestmentValueHighToLow: '#field-sortby option:nth-child(6)',
    sortByInvestmentValueLowToHigh: '#field-sortby option:nth-child(7)',
    projectName: '.c-entity-list__item:first-child h3',
    projectID: '.c-entity-list__item:first-child .c-entity__code',
    projectEstimatedLandDate: '.c-entity-list__item:first-child .c-entity__content .c-meta-item:nth-child(2) span:nth-child(2)',
    projectStage: '.c-entity-list__item:first-child .c-entity__header .c-meta-item:first-child',
    projectNameFromList: '.c-entity-list__item:first-child h3 a',
    projectLandingDateFromList: '.c-entity-list__item:first-child .c-entity__content .c-meta-item:nth-child(2) .c-meta-item__value',
    projectTypeFromFirstList: '.c-entity-list__item:first-child .c-badge.is-selected',
    projectStageFromFirstList: '.c-entity-list__item:first-child .c-badge.is-selected',
    sectorFromList: '.c-entity-list__item:first-child .c-entity__content .c-meta-item:nth-child(3) a',
    projectNameFromDetails: '.c-local-header__heading',
    removeAllFilters: {
      selector: "//a[contains(@class, 'filter-remove-all')]",
      locateStrategy: 'xpath',
    },
    removeSingleFilters: {
      selector: "//div[@class='c-results-summary__filters']/span[1]/a",
      locateStrategy: 'xpath',
    },
  },

  commands: [
    {
      verifyProjectHeaders () {
        return this
          .verify.visible('@projectName')
          .verify.visible('@projectID')
          .verify.visible('@projectStage')
          .verify.visible('@projectEstimatedLandDate')
      },

      verifyProjectFilters1 () {
        return this
          .verify.visible('@sectorFilter')
      },

      verifyProjectFilters2 () {
        return this
          .verify.visible('@stageFilterProspect')
          .verify.visible('@stageFilterAssignPM')
          .verify.visible('@stageFilterActive')
          .verify.visible('@stageFilterVerifyWin')
          .verify.visible('@stageFilterWon')
          .verify.visible('@typeofInvestmentFilterCommitmentToInvest')
          .verify.visible('@typeofInvestmentFilterFDI')
          .verify.visible('@typeofInvestmentFilterNonFDI')
          .verify.visible('@datesFromFilter')
          .verify.visible('@datesToFilter')
      },

      selectProjectStage (stage) {
        if (stage === 'Prospect') {
          this.click('@stageFilterProspect')
        } else if (stage === 'Active') {
          this.click('@stageFilterActive')
        } else if (stage === 'Assign PM') {
          this.click('@stageFilterAssignPM')
        } else if (stage === 'Verify win') {
          this.click('@stageFilterVerifyWin')
        } else if (stage === 'Won') {
          this.click('@stageFilterWon')
        }
        return this
      },

      selectProjectStatus (status) {
        if (status === 'Delayed') {
          this.click('@statusFilterDelayed')
        } else if (status === 'Dormant') {
          this.click('@statusFilterDormant')
        } else if (status === 'Abandoned') {
          this.click('@statusFilterAbandoned')
        } else if (status === 'Lost') {
          this.click('@statusFilterLost')
        } else if (status === 'Ongoing') {
          this.click('@statusFilterOngoing')
        }
        return this
      },

      selectInvestmentType (type) {
        if (type === 'Commitment to invest') {
          this.click('@typeofInvestmentFilterCommitmentToInvest')
        } else if (type === 'FDI') {
          this.click('@typeofInvestmentFilterFDI')
        } else if (type === 'Non-FDI') {
          this.click('@typeofInvestmentFilterNonFDI')
        }
        return this
      },
    },
  ],
}
