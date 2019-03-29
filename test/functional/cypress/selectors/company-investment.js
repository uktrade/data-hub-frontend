module.exports = {
  tabs: {
    investmentProjects: '[data-auto-id=investment-projects-tab]',
    largeCapitalProfile: '[data-auto-id=large-capital-profile-tab]',
    growthCapitalProfile: '[data-auto-id=growth-capital-profile-tab]',
  },
  subHeading: '[data-auto-id=investment-subheading]',
  createAProfile: '[data-auto-id=create-a-profile]',
  investorDetails: {
    incompleteFields: '[data-auto-id=investor-details] .incomplete-fields',
    summary: '[data-auto-id=investor-details] summary',
    edit: '[data-auto-id=investor-details-edit]',
    save: '[data-auto-id=investor-details-save]',
    taskList: {
      investorType: {
        name: '[data-auto-id=investor-type] .task-list-item-name',
        incomplete: '[data-auto-id=investor-type] .task-list-item-incomplete',
      },
      globalAssetsUnderManagement: {
        name: '[data-auto-id=global-assets-under-management] .task-list-item-name',
        incomplete: '[data-auto-id=global-assets-under-management] .task-list-item-incomplete',
      },
      investableCapital: {
        name: '[data-auto-id=investable-capital] .task-list-item-name',
        incomplete: '[data-auto-id=investable-capital] .task-list-item-incomplete',
      },
      investorDescription: {
        name: '[data-auto-id=investor-description] .task-list-item-name',
        incomplete: '[data-auto-id=investor-description] .task-list-item-incomplete',
      },
      investorChecks: {
        name: '[data-auto-id=investor-checks] .task-list-item-name',
        incomplete: '[data-auto-id=investor-checks] .task-list-item-incomplete',
      },
    },
  },
  investorRequirements: {
    incompleteFields: '[data-auto-id=investor-requirements] .incomplete-fields',
    summary: '[data-auto-id=investor-requirements] summary',
    edit: '[data-auto-id=investor-requirements-edit]',
    save: '[data-auto-id=investor-requirements-save]',
  },
  location: {
    incompleteFields: '[data-auto-id=location] .incomplete-fields',
    summary: '[data-auto-id=location] summary',
    edit: '[data-auto-id=edit-location]',
    save: '[data-auto-id=save-location]',
  },
}
