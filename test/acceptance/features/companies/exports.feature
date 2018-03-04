@companies-export-save
Feature: Company export save

  @companies-export-save--save
  Scenario: Save company export details

    When I navigate to the `companies.Fixture` page using `company` `Lambda plc` fixture
    And I click the Export local nav link
    Then the Exports details are displayed
      | key                          | value                             |
      | Export win category          | None                              |
      | Currently exporting to       | company.currentlyExportingTo      |
      | Future countries of interest | company.futureCountriesOfInterest |
    When the Exports details are updated
    Then the Exports details are displayed
      | key                          | value                             |
      | Export win category          | company.exportWinCategory         |
      | Currently exporting to       | company.currentlyExportingTo      |
      | Future countries of interest | company.futureCountriesOfInterest |
