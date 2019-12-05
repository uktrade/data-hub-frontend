const companyProfile = require('../../../../../../../test/unit/data/companies/investments/large-capital-profile-new.json')
const company = require('../../../../../../../test/unit/data/companies/minimal-company.json')
const ukRegion = require('../../../../../../../test/unit/data/companies/investments/metadata/uk-region.json')
const country = require('../../../../../../../test/unit/data/companies/investments/metadata/country.json')

const { cloneDeep } = require('lodash')
const config = require('../../../../../../config')

const buildMiddlewareParameters = require('../../../../../../../test/unit/helpers/middleware-parameters-builder')
const controller = require('../controllers/index')

describe('Company Investments - Large capital profile - Investor details', () => {
  describe('renderProfile', () => {
    context('when the user is editing the "Location" section', () => {
      beforeEach(async () => {
        const clonedCompanyProfile = cloneDeep(companyProfile)

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${company.id}`)
          .reply(200, clonedCompanyProfile)
          .get('/v4/metadata/uk-region')
          .reply(200, ukRegion)
          .get('/v4/metadata/country')
          .reply(200, country)

        this.middlewareParameters = buildMiddlewareParameters({
          company,
          requestQuery: {
            editing: 'location',
          },
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      const profile = {
        editing: 'location',
        id: companyProfile.results[0].id,
        investorDetails: {
          incompleteFields: 5,
          investorType: {
            text: null,
            value: null,
          },
          globalAssetsUnderManagement: {
            value: null,
          },
          investableCapital: {
            value: null,
          },
          investorDescription: {
            value: '',
          },
          requiredChecks: {
            adviser: null,
            date: null,
            type: null,
            value: null,
          },
        },
        investorRequirements: {
          incompleteFields: 9,
          dealTicketSizes: {
            value: [],
          },
          assetClasses: {
            energyAndInfrastructure: {
              value: [],
            },
            realEstate: {
              value: [],
            },
          },
          investmentTypes: {
            value: [],
          },
          minimumReturnRate: {
            text: null,
            value: null,
          },
          timeHorizons: {
            value: [],
          },
          restrictions: {
            value: [],
          },
          constructionRisks: {
            value: [],
          },
          minimumEquityPercentage: {
            text: null,
            value: null,
          },
          desiredDealRoles: {
            value: [],
          },
        },
        location: {
          incompleteFields: 3,
          notes_on_locations: '',
          uk_region_locations: {
            items: [
              {
                label: 'All',
                value: '1718e330-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'East Midlands',
                value: '844cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'East of England',
                value: '864cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'London',
                value: '874cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'North East',
                value: '814cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'North West',
                value: '824cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'Northern Ireland',
                value: '8e4cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'Scotland',
                value: '8c4cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'South East',
                value: '884cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'South West',
                value: '894cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'UKTI Dubai Hub',
                value: 'e1dd40e9-3dfd-e311-8a2b-e4115bead28a',
              },
              {
                label: 'Wales',
                value: '8d4cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'West Midlands',
                value: '854cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'Yorkshire and The Humber',
                value: '834cd12a-6095-e211-a939-e4115bead28a',
              },
            ],
            value: [],
          },
          other_countries_being_considered: {
            items: [
              { 'value': '87756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Afghanistan' }, { 'value': '945f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Albania' }, { 'value': '955f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Algeria' }, { 'value': '975f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Andorra' }, { 'value': '985f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Angola' }, { 'value': '995f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Anguilla' }, { 'value': '9b5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Antigua and Barbuda' }, { 'value': '9c5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Argentina' }, { 'value': '9d5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Armenia' }, { 'value': '9f5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Australia' }, { 'value': 'a05f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Austria' }, { 'value': 'a15f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Azerbaijan' }, { 'value': 'a25f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bahamas' }, { 'value': 'a35f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bahrain' }, { 'value': 'a45f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bangladesh' }, { 'value': 'a55f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Barbados' }, { 'value': 'a65f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Belarus' }, { 'value': 'a75f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Belgium' }, { 'value': 'a85f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Belize' }, { 'value': 'a95f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Benin' }, { 'value': 'aa5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bermuda' }, { 'value': 'ab5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bhutan' }, { 'value': 'ac5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bolivia' }, { 'value': 'ad5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Bosnia and Herzegovina' }, { 'value': 'ae5f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Botswana' }, { 'value': 'b05f66a0-5d95-e211-a939-e4115bead28a', 'label': 'Brazil' }, { 'value': 'b25f66a0-5d95-e211-a939-e4115bead28a', 'label': 'British Virgin Islands' }, { 'value': '56af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Brunei' }, { 'value': '57af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Bulgaria' }, { 'value': '58af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Burkina' }, { 'value': '59af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Burma' }, { 'value': '5aaf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Burundi' }, { 'value': '5baf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Cambodia' }, { 'value': '5caf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Cameroon' }, { 'value': '5daf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Canada' }, { 'value': '5eaf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Cape Verde' }, { 'value': '5faf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Cayman Islands' }, { 'value': '60af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Central African Republic' }, { 'value': '61af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Chad' }, { 'value': '62af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Chile' }, { 'value': '63af72a6-5d95-e211-a939-e4115bead28a', 'label': 'China' }, { 'value': '66af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Colombia' }, { 'value': '67af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Comoros' }, { 'value': '69af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Congo' }, { 'value': '68af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Congo (Democratic Republic)' }, { 'value': '6baf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Costa Rica' }, { 'value': '6caf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Croatia' }, { 'value': '6daf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Cuba' }, { 'value': '6eaf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Cyprus' }, { 'value': '6faf72a6-5d95-e211-a939-e4115bead28a', 'label': 'Czech Republic' }, { 'value': '70af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Denmark' }, { 'value': '71af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Djibouti' }, { 'value': '72af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Dominica' }, { 'value': '73af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Dominican Republic' }, { 'value': '74af72a6-5d95-e211-a939-e4115bead28a', 'label': 'East Timor' }, { 'value': '75af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Ecuador' }, { 'value': '76af72a6-5d95-e211-a939-e4115bead28a', 'label': 'Egypt' }, { 'value': 'd2f682ac-5d95-e211-a939-e4115bead28a', 'label': 'El Salvador' }, { 'value': 'd3f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Equatorial Guinea' }, { 'value': 'd4f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Eritrea' }, { 'value': 'd5f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Estonia' }, { 'value': 'd6f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Ethiopia' }, { 'value': 'd7f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Falkland Islands' }, { 'value': 'd8f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Faroe Islands' }, { 'value': 'd9f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Fiji' }, { 'value': 'daf682ac-5d95-e211-a939-e4115bead28a', 'label': 'Finland' }, { 'value': '82756b9a-5d95-e211-a939-e4115bead28a', 'label': 'France' }, { 'value': 'def682ac-5d95-e211-a939-e4115bead28a', 'label': 'Gabon' }, { 'value': 'dff682ac-5d95-e211-a939-e4115bead28a', 'label': 'Gambia' }, { 'value': 'e0f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Georgia' }, { 'value': '83756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Germany' }, { 'value': 'e1f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Ghana' }, { 'value': 'e2f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Gibraltar' }, { 'value': 'e3f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Greece' }, { 'value': 'e4f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Greenland' }, { 'value': 'e5f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Grenada' }, { 'value': 'e8f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Guatemala' }, { 'value': '77756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Guernsey' }, { 'value': 'e9f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Guinea' }, { 'value': 'eaf682ac-5d95-e211-a939-e4115bead28a', 'label': 'Guinea-Bissau' }, { 'value': 'ebf682ac-5d95-e211-a939-e4115bead28a', 'label': 'Guyana' }, { 'value': 'ecf682ac-5d95-e211-a939-e4115bead28a', 'label': 'Haiti' }, { 'value': 'eff682ac-5d95-e211-a939-e4115bead28a', 'label': 'Honduras' }, { 'value': 'f0f682ac-5d95-e211-a939-e4115bead28a', 'label': 'Hong Kong (SAR)' }, { 'value': '6d6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Hungary' }, { 'value': '6e6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Iceland' }, { 'value': '6f6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'India' }, { 'value': '706a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Indonesia' }, { 'value': '716a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Iran' }, { 'value': '726a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Iraq' }, { 'value': '736a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Ireland' }, { 'value': '79756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Isle of Man' }, { 'value': '746a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Israel' }, { 'value': '84756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Italy' }, { 'value': '756a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Ivory Coast' }, { 'value': '766a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Jamaica' }, { 'value': '85756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Japan' }, { 'value': '78756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Jersey' }, { 'value': '776a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Jordan' }, { 'value': '786a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Kazakhstan' }, { 'value': '796a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Kenya' }, { 'value': '7b6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Korea (North)' }, { 'value': '7c6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Korea (South)' }, { 'value': '7a756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Kosovo' }, { 'value': '7d6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Kuwait' }, { 'value': '7e6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Kyrgyzstan' }, { 'value': '7f6a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Laos' }, { 'value': '806a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Latvia' }, { 'value': '816a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Lebanon' }, { 'value': '826a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Lesotho' }, { 'value': '836a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Liberia' }, { 'value': '846a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Libya' }, { 'value': '856a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Liechtenstein' }, { 'value': '866a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Lithuania' }, { 'value': '876a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Luxembourg' }, { 'value': '886a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Macao (SAR)' }, { 'value': '896a9ab2-5d95-e211-a939-e4115bead28a', 'label': 'Macedonia' }, { 'value': '0350bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Madagascar' }, { 'value': '0450bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Malawi' }, { 'value': '0550bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Malaysia' }, { 'value': '0650bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Maldives' }, { 'value': '0750bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Mali' }, { 'value': '0850bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Malta' }, { 'value': '0b50bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Mauritania' }, { 'value': '0c50bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Mauritius' }, { 'value': '0e50bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Mexico' }, { 'value': '1050bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Moldova' }, { 'value': '1150bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Monaco' }, { 'value': '1250bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Mongolia' }, { 'value': '7f756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Montenegro' }, { 'value': '1350bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Montserrat' }, { 'value': '1450bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Morocco' }, { 'value': '1550bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Mozambique' }, { 'value': '1650bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Namibia' }, { 'value': '1750bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Nauru' }, { 'value': '1850bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Nepal' }, { 'value': '1950bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Netherlands' }, { 'value': '1c50bdb8-5d95-e211-a939-e4115bead28a', 'label': 'New Zealand' }, { 'value': '1d50bdb8-5d95-e211-a939-e4115bead28a', 'label': 'Nicaragua' }, { 'value': '4461b8be-5d95-e211-a939-e4115bead28a', 'label': 'Niger' }, { 'value': '4561b8be-5d95-e211-a939-e4115bead28a', 'label': 'Nigeria' }, { 'value': '4961b8be-5d95-e211-a939-e4115bead28a', 'label': 'Norway' }, { 'value': '35afd8d0-5d95-e211-a939-e4115bead28a', 'label': 'Occupied Palestinian Territories' }, { 'value': '4a61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Oman' }, { 'value': '4b61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Pakistan' }, { 'value': '4c61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Palau' }, { 'value': '4d61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Panama' }, { 'value': '4e61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Papua New Guinea' }, { 'value': '4f61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Paraguay' }, { 'value': '5061b8be-5d95-e211-a939-e4115bead28a', 'label': 'Peru' }, { 'value': '5161b8be-5d95-e211-a939-e4115bead28a', 'label': 'Philippines' }, { 'value': '5361b8be-5d95-e211-a939-e4115bead28a', 'label': 'Poland' }, { 'value': '5461b8be-5d95-e211-a939-e4115bead28a', 'label': 'Portugal' }, { 'value': '5561b8be-5d95-e211-a939-e4115bead28a', 'label': 'Puerto Rico' }, { 'value': '5661b8be-5d95-e211-a939-e4115bead28a', 'label': 'Qatar' }, { 'value': '5861b8be-5d95-e211-a939-e4115bead28a', 'label': 'Romania' }, { 'value': '5961b8be-5d95-e211-a939-e4115bead28a', 'label': 'Russia' }, { 'value': '5a61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Rwanda' }, { 'value': '5b61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Samoa' }, { 'value': '5c61b8be-5d95-e211-a939-e4115bead28a', 'label': 'San Marino' }, { 'value': '5d61b8be-5d95-e211-a939-e4115bead28a', 'label': 'Sao Tome and Principe' }, { 'value': '1a0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Saudi Arabia' }, { 'value': '1b0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Senegal' }, { 'value': '1c0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Serbia' }, { 'value': '1d0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Seychelles' }, { 'value': '1e0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Sierra Leone' }, { 'value': '1f0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Singapore' }, { 'value': '200be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Slovakia' }, { 'value': '210be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Slovenia' }, { 'value': '220be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Solomon Islands' }, { 'value': '230be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Somalia' }, { 'value': '240be5c4-5d95-e211-a939-e4115bead28a', 'label': 'South Africa' }, { 'value': '86756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Spain' }, { 'value': '260be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Sri Lanka' }, { 'value': '280be5c4-5d95-e211-a939-e4115bead28a', 'label': 'St Kitts and Nevis' }, { 'value': '290be5c4-5d95-e211-a939-e4115bead28a', 'label': 'St Lucia' }, { 'value': '7c756b9a-5d95-e211-a939-e4115bead28a', 'label': 'St Martin' }, { 'value': '2b0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'St Vincent' }, { 'value': '2c0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Sudan' }, { 'value': '7e756b9a-5d95-e211-a939-e4115bead28a', 'label': 'Sudan, South' }, { 'value': '2d0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Surinam' }, { 'value': '2f0be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Swaziland' }, { 'value': '300be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Sweden' }, { 'value': '310be5c4-5d95-e211-a939-e4115bead28a', 'label': 'Switzerland' }, { 'value': 'a46ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Syria' }, { 'value': 'a56ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Taiwan' }, { 'value': 'a66ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Tajikistan' }, { 'value': 'a76ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Tanzania' }, { 'value': 'a86ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Thailand' }, { 'value': 'a96ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Togo' }, { 'value': 'ab6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Tonga' }, { 'value': 'ac6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Trinidad and Tobago' }, { 'value': 'ad6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Tunisia' }, { 'value': 'ae6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Turkey' }, { 'value': 'af6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Turkmenistan' }, { 'value': 'b06ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Turks and Caicos Islands' }, { 'value': 'b16ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Tuvalu' }, { 'value': 'b26ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Uganda' }, { 'value': 'b36ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Ukraine' }, { 'value': 'b46ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'United Arab Emirates' }, { 'value': '80756b9a-5d95-e211-a939-e4115bead28a', 'label': 'United Kingdom' }, { 'value': '81756b9a-5d95-e211-a939-e4115bead28a', 'label': 'United States' }, { 'value': 'b66ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Uruguay' }, { 'value': 'b76ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Uzbekistan' }, { 'value': 'b86ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Vanuatu' }, { 'value': 'eef682ac-5d95-e211-a939-e4115bead28a', 'label': 'Vatican City' }, { 'value': 'b96ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Venezuela' }, { 'value': 'ba6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Vietnam' }, { 'value': 'bb6ee1ca-5d95-e211-a939-e4115bead28a', 'label': 'Virgin Islands (US)' }, { 'value': '37afd8d0-5d95-e211-a939-e4115bead28a', 'label': 'Yemen' }, { 'value': '38afd8d0-5d95-e211-a939-e4115bead28a', 'label': 'Zambia' }, { 'value': '39afd8d0-5d95-e211-a939-e4115bead28a', 'label': 'Zimbabwe' },
            ],
            value: [],
          },
        },
      }

      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function and pass the view', () => {
        const view = 'companies/apps/investments/large-capital-profile/views/profile'
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(view)
      })

      it('should call the render function and pass the profile', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].profile).to.deep.equal(profile)
      })
    })
  })
})
