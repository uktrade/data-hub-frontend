@interactions-create @ignore
Feature: Save an Interaction in Data hub
  As a data hub user
  I would like to add an interaction to data hub
  So that I can collection interaction data

Background:
  Given I am an authenticated user on the data hub website

  @interactions-create--companies-interaction
  Scenario: Save interaction from companies

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company interaction step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--contacts-interaction @ignore
  Scenario: Save interaction from contacts

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create contact interaction step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--investment-projects-interaction @ignore
  Scenario: Save interaction from investment projects

    And a company is created for interactions
    And a company investment project is created for interactions
    When navigating to the create investment project interaction step 1 page
    And selecting interaction
    Then there are interaction fields
    And interaction fields are pre-populated

  @interactions-create--companies-service-delivery
  Scenario: Save service delivery from companies

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company service delivery step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--contacts-service-delivery @ignore
  Scenario: Save service delivery from contacts

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create contact service delivery step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--investment-projects-service-delivery @ignore
  Scenario: Save service delivery from investment projects

    And a company is created for interactions
    And a company investment project is created for interactions
    When navigating to the create investment project service delivery step 1 page
    And selecting service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated

  @interactions-create--events-toggle
  Scenario: Toggle service delivery event association

    And a company is created for interactions
    And a company contact is created for interactions
    When navigating to the create company service delivery step 1 page
    And selecting service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed
