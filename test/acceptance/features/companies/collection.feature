@companies-collection
Feature: View collection of companies
  As an existing user
  I would like to view all the Companies in one place
  And be able to read the companies details as expected

  @companies-collection--view
  Scenario: View contact collection

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
