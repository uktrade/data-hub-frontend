@contacts-create
Feature: Create New Contact
  As a data hub user
  I would like to add an contact to data hub
  So that I can collect contact data

  Background:
    Given I am an authenticated user on the data hub website

  @contacts-create--companies-interaction
  Scenario: Interaction fields from companies

    And a company is created for contacts
    When navigating to the create company contact page
    And the add new contact button is clicked
    Then there are contact fields

