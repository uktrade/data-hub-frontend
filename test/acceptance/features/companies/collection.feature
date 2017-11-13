@companies-collection
Feature: View collection of companies
  As an existing user
  I would like to view all the Companies in one place
  And be able to read the companies details as expected

  @companies-collection--view
  Scenario: View companies collection

    Given a company is created
    Then I see the success message
    When I navigate to the Companies collection page
    Then there are Companies headings
    And there is an Add company button in the collection header
    And I can view the Company in the collection
      | label              | statePath      |
      | Sector             | company.sector |
      | Registered address |                |
    And the Company has badges
      | text           |
      | Country        |
      | UK region      |


  @companies-collection--filter
  Scenario: Filter companies list

    Given a company is created
    Then I see the success message
    When I navigate to the Companies collection page
#    And I filter the companies list by company todo: bug fix https://uktrade.atlassian.net/browse/DH-1085
#    Then the companies should be filtered by company name
#    When the company filter is cleared
    And I filter the companies list by sector
    Then the companies should be filtered by company sector
    When the sector filter is cleared
    Then there are no filters selected
    And the result count should be reset
#    When I filter the companies list by country TODO: bug fix https://uktrade.atlassian.net/browse/DH-1154
#    Then the companies should be filtered to show badge company country
#    When the country filter is cleared
#    Then there are no filters selected
#    And the result count should be reset
#    When I filter the companies list by country TODO: bug fix https://uktrade.atlassian.net/browse/DH-1155
#    And I filter the companies list by UK region
#    Then the companies should be filtered to show badge company country
#    Then the companies should be filtered to show badge company UK region
#    When I click on the first company collection link
#    Then the company details UK region is displayed
