@filter-contacts
Feature: Filters collections for contact
  As an existing user
  I would like to filter contacts using possible options
  So that I can quickly drill down to find the correct information that I am looking for

  @filter-contacts-sector
  Scenario: Filter contacts by sector

    Given I am an authenticated user on Data Hub website
    When I navigate to contacts collection page
    And I filter the display by contacts sector
    Then I verify the display is changed based on the given sector for contact

  @filter-contacts-country
  Scenario: Filter contacts by country

    Given I am an authenticated user on Data Hub website
    When I navigate to contacts collection page
    And I filter the display by country
    Then I verify the display is changed based on the given country

  @filter-contacts-region
  Scenario: Filter contacts by region

    Given I am an authenticated user on Data Hub website
    When I navigate to contacts collection page
    And I filter the display by region
    Then I verify the display is changed based on the given region

  @filter-contacts-company
  Scenario: Filter contacts by company name

    Given I am an authenticated user on Data Hub website
    When I navigate to contacts collection page
    And I filter the display by company name
    Then I verify the display is changed based on the given company name
