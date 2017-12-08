@companies-export-save
Feature: Company export save

  @companies-export-save--save
  Scenario: Save company export details

    Given a company is created
    When I navigate to the company "Export" tab
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
