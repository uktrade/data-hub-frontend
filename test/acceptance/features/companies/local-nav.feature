@companies-local-nav  @details
Feature: Companies local nav

  @companies-local-nav
  Scenario: Companies local nav as DIT staff

    When I navigate to the `companies.fixture` page using `company` `Venus Ltd` fixture
    Then there should be a local nav
      | text                      |
      | Details                   |
      | Subsidiaries              |
      | Contacts                  |
      | Interactions              |
      | Export                    |
      | Investment                |
      | Orders (OMIS)             |
      | Audit history             |
      | Documents                 |

  @companies-local-nav--lep @lep
  Scenario: Companies local nav as LEP

    When I navigate to the `companies.fixture` page using `company` `Venus Ltd` fixture
    Then there should be a local nav
      | text                      |
      | Details                   |
      | Subsidiaries              |
      | Contacts                  |
      | Export                    |
      | Investment                |
      | Audit history             |

  @companies-local-nav--da @da
  Scenario: Companies local nav as DA

    When I navigate to the `companies.fixture` page using `company` `Venus Ltd` fixture
    Then there should be a local nav
      | text                      |
      | Details                   |
      | Subsidiaries              |
      | Contacts                  |
      | Export                    |
      | Investment                |
      | Orders (OMIS)             |
      | Audit history             |
