@companies-export-save
Feature: Company export save

  @companies-export-save--save
  Scenario: Save company export details

    And the Exports details are displayed
      | key                          | value                      |
      | Export win category          | None                       |
      | Currently exporting to       | None                       |
      | Future countries of interest | None                       |
    And the Exports details are updated
    And the Exports details are displayed
      | key                          | value                      |
      | Export win category          | company.exportWinCategory  |
      | Currently exporting to       | None                       |
      | Future countries of interest | None                       |
    Given I navigate to company fixture Lambda plc
    When I click the Export local nav link
