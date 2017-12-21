# TODO archived filters and sort
@companies-collection @collection
Feature: View collection of companies
  As an existing user
  I would like to view all the Companies in one place
  And be able to read the companies details as expected

  @companies-collection--view
  Scenario: View companies collection

    When a "Foreign company" is created
    Then I see the success message
    When I navigate to the Companies collection page
    Then I confirm I am on the Companies page
    And the results count header for companies is present
    And there is an Add company button in the collection header
    And I can view the Company in the collection
      | text               | expected                  |
      | Sector             | company.sector            |
      | Primary address    | company.primaryAddress    |
    And the Company has badges
      | text               | expected                  |
      | Country            | company.country           |
      | UK region          | company.ukRegion          |

  @companies-collection--filter
  Scenario: Filter companies list

    When a "UK non-private or non-public limited company" is created
    Then I see the success message
    When I navigate to the Companies collection page
    And I filter the companies list by company
    Then the companies should be filtered by company name
    When the company filter is cleared
    And I filter the companies list by sector
    Then the companies should be filtered by company sector
    When the sector filter is cleared
    Then there are no filters selected
    And the result count should be reset
    When I filter the companies list by country
    Then the companies should be filtered to show badge company country
    When the country filter is cleared
    Then there are no filters selected
    And the result count should be reset
    When I filter the companies list by country
    And I filter the companies list by UK region
    Then the companies should be filtered to show badge company country
    And the companies should be filtered to show badge company UK region
    When I click on the first company collection link
    Then the company details UK region is displayed


  @companies-collection--sort
  Scenario: Sort companies list

    When a "Foreign company" is created
    Then I see the success message
    When I navigate to the Companies collection page
    And the companies are sorted by Recently updated
    And the companies are sorted by Least recently updated
    Then the companies should have been correctly sorted by updated date
    When the companies are sorted by Company name: A-Z
    And the companies are sorted by Company name: Z-A
    Then the companies should have been correctly sorted for text fields
