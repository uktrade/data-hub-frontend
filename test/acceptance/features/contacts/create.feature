@contacts-create
Feature: Create New Contact
  As a data hub user
  I would like to add an contact to data hub
  So that I can collect contact data

  @contacts-create--companies-interaction
  Scenario: Contact form fields

    Given a company is created
    When navigating to the create company contact page
    And I click the "Add contact" link
    Then there are contact fields

