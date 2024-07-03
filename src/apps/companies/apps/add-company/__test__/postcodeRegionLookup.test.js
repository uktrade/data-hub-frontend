import { UK_REGIONS } from '../../../../../common/constants'
import { mapPostcodeToRegion } from '../client/transformer'

const postcodeArrayTest = (postcodes, regionId, regionName, areaName) => {
  it(`should return the ${regionName} region ID when a ${areaName} postcode is passed`, () => {
    postcodes.forEach(function (value) {
      expect(mapPostcodeToRegion(value)).to.equal(regionId)
    })
  })
}

describe('Postcode to region mapping', () => {
  context('When an invalid postcode is passed', () => {
    it('should return an empty string instead of a region ID', () => {
      const invalidPostcode1 = 'AAAAAAAA'
      const invalidPostcode2 = '        '
      const invalidPostcode3 = 'A12'
      const invalidPostcode4 = undefined
      const invalidPostcode5 = null
      expect(mapPostcodeToRegion(invalidPostcode1)).to.equal('')
      expect(mapPostcodeToRegion(invalidPostcode2)).to.equal('')
      expect(mapPostcodeToRegion(invalidPostcode3)).to.equal('')
      expect(mapPostcodeToRegion(invalidPostcode4)).to.equal('')
      expect(mapPostcodeToRegion(invalidPostcode5)).to.equal('')
    })
  })

  context('When a East Midlands postcode is passed', () => {
    const derbyPostcodes = ['DE45 1AA', 'DE3 0AA']
    const leicesterPostcodes = ['LE11AF', 'LE100AA']
    const lincolnPostcodes = ['LN2 1AA', 'LN139DR']
    const nottinghamPostcodes = ['NG25 0NJ', 'NG6 8EN']
    const northamptonPostcodes = ['NN16 0AU', 'NN7 3LD']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.EAST_MIDLANDS, 'East Midlands', area)
    }

    template(derbyPostcodes, 'Derby')
    template(leicesterPostcodes, 'Leicester')
    template(lincolnPostcodes, 'Lincoln')
    template(nottinghamPostcodes, 'Nottingham')
    template(northamptonPostcodes, 'Northampton')
  })

  context('When an East of England postcode is passed', () => {
    const stAlbansPostcodes = ['AL100AA', 'AL86YT']
    const cambridgePostcodes = ['CB22 3AA', 'CB3 0AH']
    const chemlsfordPostcodes = ['CM92 1LA', 'CM7 5NF']
    const colchesterPostcodes = ['CO168PB', 'CO58FN']
    const hemelPostcodes = ['HP27 0AP', 'HP5 5UQ']
    const ipswichPostcodes = ['IP18 6AA', 'IP9 2EL']
    const lutonPostcodes = ['LU7 0AD']
    const norwichPostcodes = ['NR6 6NQ', 'NR35 2BE']
    const peterboroughPostcodes = ['PE316AA', 'PE11AB']
    const stevenagePostcodes = ['SG166AA', 'SG61AA']
    const southendPostcodes = ['SS22 7AA', 'SS5 4AA']
    const watfordPostcodes = ['WD25 0AD', 'WD7 0AL']

    const template = (arr, area) => {
      postcodeArrayTest(
        arr,
        UK_REGIONS.EAST_OF_ENGLAND,
        'East of England',
        area
      )
    }

    template(stAlbansPostcodes, 'St. Albans')
    template(cambridgePostcodes, 'Cambridge')
    template(chemlsfordPostcodes, 'Chelmsford')
    template(colchesterPostcodes, 'Colchester')
    template(hemelPostcodes, 'Hemel Hempstead')
    template(ipswichPostcodes, 'Ipswich')
    template(lutonPostcodes, 'Luton')
    template(norwichPostcodes, 'Norwich')
    template(peterboroughPostcodes, 'Peterborough')
    template(stevenagePostcodes, 'Stevenage')
    template(southendPostcodes, 'Southend-On-Sea')
    template(watfordPostcodes, 'Watford')
  })

  context('When a London postcode is passed', () => {
    const croydonPostcodes = ['CR441AG', 'CR30AA']
    const eastLondonPostcodes = ['E1 0AA', 'E1W 3HN', 'E17 0AN']
    const eastCentralLondonPostcodes = ['EC1N 2AB', 'EC4Y 0AA']
    const enfieldPostcodes = ['EN1 1AA', 'EN77 1RS']
    const harrowPostcodes = ['HA90AA']
    const ilfordPostcodes = ['IG11 7SB', 'IG7 5JP']
    const kingstonPostcodes = ['KT1 3HR', 'KT21 2EZ']
    const northLondonPostcodes = ['N2 2GJ', 'N11 2QS', 'N1C 4DR']
    const northWestLondonPostcodes = ['NW26 9HX', 'NW1W 6AQ', 'NW6 5GL']
    const romfordPostcodes = ['RM11 1AD', 'RM2 5AA']
    const southEastLondonPostcodes = ['SE1 0AG', 'SE15 4NS', 'SE1P5LN']
    const suttonPostcodes = ['SM4 4AB']
    const southWestLondonPostcodes = ['SW10 1BZ', 'SW1P 1AB', 'SW4 0AR']
    const twickenhamPostcodes = ['TW1 3PB', 'TW15 1AR']
    const uxbridgePostcodes = ['UB11 1AQ', 'UB4 0AW']
    const westLondonPostcodes = ['W127PS', 'W1B4ED', 'W24JJ']
    const westCentralLondonPostcodes = ['WC1X 8TA']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.LONDON, 'London', area)
    }

    template(croydonPostcodes, 'Croydon')
    template(eastLondonPostcodes, 'East London')
    template(eastCentralLondonPostcodes, 'East Central London')
    template(enfieldPostcodes, 'Enfield')
    template(harrowPostcodes, 'Harrow')
    template(ilfordPostcodes, 'Ilford')
    template(kingstonPostcodes, 'Kingston-Upon-Thames')
    template(northLondonPostcodes, 'North London')
    template(northWestLondonPostcodes, 'North West London')
    template(romfordPostcodes, 'Romford')
    template(southEastLondonPostcodes, 'South East London')
    template(suttonPostcodes, 'Sutton')
    template(southWestLondonPostcodes, 'South West London')
    template(twickenhamPostcodes, 'Twickenham')
    template(uxbridgePostcodes, 'Uxbridge')
    template(westLondonPostcodes, 'West London')
    template(westCentralLondonPostcodes, 'West Central London')
  })

  context('When a North East postcode is passed', () => {
    const durhamPostcodes = ['DH58LG', 'DH991NS']
    const newcastlePostcodes = ['NE14XA', 'NE177AU']
    const sunderlandPostcodes = ['SR43 4FD', 'SR3 2RS']
    const teessidePostcodes = ['TS103NW', 'TS2 1PL']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.NORTH_EAST, 'North East', area)
    }

    template(durhamPostcodes, 'Durham')
    template(newcastlePostcodes, 'Newcastle Upon Tyne')
    template(sunderlandPostcodes, 'Sunderland')
    template(teessidePostcodes, 'Teesside')
  })

  context('When a Northern Ireland postcode is passed', () => {
    const belfastPostcodes = ['BT1 1AR', 'BT18 0AL']

    const template = (arr, area) => {
      postcodeArrayTest(
        arr,
        UK_REGIONS.NORTHERN_IRELAND,
        'Northern Ireland',
        area
      )
    }

    template(belfastPostcodes, 'Belfast')
  })

  context('When a North West postcode is passed', () => {
    const blackburnPostcodes = ['BB18 5AA', 'BB8 0AP']
    const boltonPostcodes = ['BL111AT', 'BL66EZ']
    const carlislePostcodes = ['CA1 2TX', 'CA18 1SG']
    const chesterPostcodes = ['CH2 1AN', 'CH28 9AE']
    const crewePostcodes = ['CW4 8AB', 'CW98 1BA']
    const fyldePostcodes = ['FY4 3RQ']
    const liverpoolPostcodes = ['L2 4SW', 'L26 6LS']
    const lancasterPostcodes = ['LA10 5AP', 'LA7 7JY']
    const manchesterPostcodes = ['M2 1AE', 'M27 0AQ']
    const oldhamPostcodes = ['OL12 7LQ', 'OL6 7RE']
    const prestonPostcodes = ['PR25 1AT', 'PR4 3HL']
    const stockportPostcodes = ['SK23 0BB', 'SK7 3NG']
    const warringtonPostcodes = ['WA55 1GG', 'WA9 3YG']
    const wiganPostcodes = ['WN6 7NR']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.NORTH_WEST, 'North West', area)
    }

    template(blackburnPostcodes, 'Blackburn')
    template(boltonPostcodes, 'Bolton')
    template(carlislePostcodes, 'Carlisle')
    template(chesterPostcodes, 'Chester')
    template(crewePostcodes, 'Crewe')
    template(fyldePostcodes, 'The Fylde (Blackpool)')
    template(liverpoolPostcodes, 'Liverpool')
    template(lancasterPostcodes, 'Lancaster')
    template(manchesterPostcodes, 'Manchester')
    template(oldhamPostcodes, 'Oldham')
    template(prestonPostcodes, 'Preston')
    template(stockportPostcodes, 'Stockport')
    template(warringtonPostcodes, 'Warrington')
    template(wiganPostcodes, 'Wigan')
  })

  context('When a Scotland postcode is passed', () => {
    const aberdeenPostcodes = ['AB140LJ']
    const dundeePostcodes = ['DD11 3LD', 'DD7 7EL']
    const dumfriesPostcodes = ['DG14 0RA', 'DG6 4NW']
    const edinburghPostcodes = ['EH14 1AP', 'EH8 8JD']
    const falkirkPostcodes = ['FK19 8NT', 'FK5 3AF']
    const glasgowPostcodes = ['G14 0AE', 'G4 7AL']
    const hebridesPostcodes = ['HS53TL']
    const invernessPostcodes = ['IV15 9QW', 'IV4 7AS']
    const kilmarnockPostcodes = ['KA15 1AB', 'KA2 0AB']
    const kirkwallPostcodes = ['KW26AA', 'KW163HT']
    const kirkcaldyPostcodes = ['KY168TE', 'KY58HU']
    const motherwellPostcodes = ['ML126AF', 'ML84AG']
    const paisleyPostcodes = ['PA12 4AE', 'PA6 7AH']
    const perthPostcodes = ['PH14 9AB', 'PH5 2BE']
    const tweeddalePostcodes = ['TD12 4AA', 'TD6 9AW']
    const zetlandPostcodes = ['ZE3 9JJ']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.SCOTLAND, 'Scotland', area)
    }

    template(aberdeenPostcodes, 'Aberdeen')
    template(dundeePostcodes, 'Dundee')
    template(dumfriesPostcodes, 'Dumfries')
    template(edinburghPostcodes, 'Edinburgh')
    template(falkirkPostcodes, 'Falkirk')
    template(glasgowPostcodes, 'Glasgow')
    template(hebridesPostcodes, 'Hebrides')
    template(invernessPostcodes, 'Inverness')
    template(kilmarnockPostcodes, 'Kilmarnock')
    template(kirkwallPostcodes, 'Kirkwall')
    template(kirkcaldyPostcodes, 'Kirkcaldy')
    template(motherwellPostcodes, 'Motherwell')
    template(paisleyPostcodes, 'Paisley')
    template(perthPostcodes, 'Perth')
    template(tweeddalePostcodes, 'Tweeddale')
    template(zetlandPostcodes, 'Zetland (Shetland)')
  })

  context('When a South East postcode is passed', () => {
    const brightonPostcodes = ['BN15 9ES', 'BN8 5JP']
    const bromleyPostcodes = ['BR5 1AB']
    const canterburyPostcodes = ['CT19 5LQ', 'CT7 9DX']
    const dartfordPostcodes = ['DA15 8EY', 'DA6 7ZF']
    const guildfordPostcodes = ['GU17 0AD', 'GU6 8EQ']
    const medwayPostcodes = ['ME13 0AD', 'ME7 3NN']
    const miltonKeynesPostcodes = ['MK17 0AA', 'MK7 7PB']
    const oxfordPostcodes = ['OX18 1AD', 'OX4 4NW']
    const portsmouthPostcodes = ['PO3 5AG', 'PO41 0TJ']
    const readingPostcodes = ['RG17 0AS', 'RG6 1AD']
    const redhillPostcodes = ['RH13 0YP', 'RH6 8DA']
    const sloughPostcodes = ['SL3 7NT', 'SL95 1UX']
    const southamptonPostcodes = ['SO21 2HH']
    const tunbridgeWellsPostcodes = ['TN16 3AL', 'TN8 6LL']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.SOUTH_EAST, 'South East', area)
    }

    template(brightonPostcodes, 'Brighton')
    template(bromleyPostcodes, 'Bromley')
    template(canterburyPostcodes, 'Canterbury')
    template(dartfordPostcodes, 'Dartford')
    template(guildfordPostcodes, 'Guildford')
    template(medwayPostcodes, 'Medway')
    template(miltonKeynesPostcodes, 'Milton Keynes')
    template(oxfordPostcodes, 'Oxford')
    template(portsmouthPostcodes, 'Portsmouth')
    template(readingPostcodes, 'Reading')
    template(redhillPostcodes, 'Redhill')
    template(sloughPostcodes, 'Slough')
    template(southamptonPostcodes, 'Southampton')
    template(tunbridgeWellsPostcodes, 'Tunbridge Wells')
  })

  context('When a South West postcode is passed', () => {
    const bathPostcodes = ['BA16 0QW', 'BA3 4GJ']
    const bournemouthPostcodes = ['BH18 8AW', 'BH7 7AQ']
    const bristolPostcodes = ['BS14 8HR', 'BS8 1AJ']
    const dorchesterPostcodes = ['DT11 7SW', 'DT4 7UP']
    const exeterPostcodes = ['EX24 6NG', 'EX7 9AU']
    const gloucesterPostcodes = ['GL56 0AF', 'GL8 8NP']
    const plymouthPostcodes = ['PL19 8GB', 'PL5 3BN']
    const swindonPostcodes = ['SN26 7AB', 'SN6 7PP']
    const salisburyPostcodes = ['SP11 0AF', 'SP5 3FB']
    const tauntonPostcodes = ['TA15 6XH', 'TA9 3TB']
    const torquayPostcodes = ['TQ14 0AE', 'TQ2 5AF']
    const truroPostcodes = ['TR15 2RZ', 'TR4 8UF']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.SOUTH_WEST, 'South West', area)
    }

    template(bathPostcodes, 'Bath')
    template(bournemouthPostcodes, 'Bournemouth')
    template(bristolPostcodes, 'Bristol')
    template(dorchesterPostcodes, 'Dorchester')
    template(exeterPostcodes, 'Exeter')
    template(gloucesterPostcodes, 'Gloucester')
    template(plymouthPostcodes, 'Plymouth')
    template(swindonPostcodes, 'Swindon')
    template(salisburyPostcodes, 'Salisbury')
    template(tauntonPostcodes, 'Taunton')
    template(torquayPostcodes, 'Torquay')
    template(truroPostcodes, 'Truro')
  })

  context('When a Wales postcode is passed', () => {
    const cardiffPostcodes = ['CF23 0AS', 'CF5 4DL']
    const llandrindodWellsPostcodes = ['LD7 1RB']
    const llandudnoPostcodes = ['LL78 7JF']
    const newportPostcodes = ['NP8 1AG', 'NP23 5RT']
    const swanseaPostcodes = ['SA1 5PN', 'SA39 9HP']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.WALES, 'Wales', area)
    }

    template(cardiffPostcodes, 'Cardiff')
    template(llandrindodWellsPostcodes, 'Llandrindod Wells')
    template(llandudnoPostcodes, 'Llandudno')
    template(newportPostcodes, 'Newport')
    template(swanseaPostcodes, 'Swansea')
  })

  context('When a West Midlands postcode is passed', () => {
    const birminghamPostcodes = ['B80 7AA', 'B9 4AE']
    const coventryPostcodes = ['CV11 4AA', 'CV4 8NF']
    const dudleyPostcodes = ['DY13 0AD', 'DY7 5AA']
    const herefordPostcodes = ['HR6 8LZ']
    const stokePostcodes = ['ST18 0WZ', 'ST6 5NT']
    const shrewsburyPostcodes = ['SY14 7AN', 'SY7 8JG']
    const telfordPostcodes = ['TF13 6AB', 'TF6 5AB']
    const worcesterPostcodes = ['WR14 3AP', 'WR5 2QN']
    const walsallPostcodes = ['WS14 4PP', 'WS6 7AX']
    const wolverhamptonPostcodes = ['WV12 4AH', 'WV6 7QH']

    const template = (arr, area) => {
      postcodeArrayTest(arr, UK_REGIONS.WEST_MIDLANDS, 'West Midlands', area)
    }

    template(birminghamPostcodes, 'Birmingham')
    template(coventryPostcodes, 'Coventry')
    template(dudleyPostcodes, 'Dudley')
    template(herefordPostcodes, 'Hereford')
    template(stokePostcodes, 'Stoke-On-Trent')
    template(shrewsburyPostcodes, 'Shrewsbury')
    template(telfordPostcodes, 'Telford')
    template(worcesterPostcodes, 'Worcester')
    template(walsallPostcodes, 'Walsall')
    template(wolverhamptonPostcodes, 'Wolverhampton')
  })

  context('When a Yorkshire postcode is passed', () => {
    const bradfordPostcodes = ['BD14 6AD', 'BD8 8AQ']
    const darlingtonPostcodes = ['DL16 7DN', 'DL9 4EP']
    const doncasterPostcodes = ['DN19 7AA', 'DN5 7XX']
    const huddersfieldPostcodes = ['HD5 8SN']
    const harrogatePostcodes = ['HG4 3DD']
    const hullPostcodes = ['HU19 2LZ', 'HU6 8HQ']
    const halifaxPostcodes = ['HX4 8PH']
    const leedsPostcodes = ['LS17 7EU', 'LS4 2PH']
    const sheffieldPostcodes = ['S91 1AB', 'S7 2WZ']
    const wakefieldPostcodes = ['WF12 7TQ', 'WF7 6JB']
    const yorkPostcodes = ['YO8 6DH', 'YO18 7ZP']

    const template = (arr, area) => {
      postcodeArrayTest(
        arr,
        UK_REGIONS.YORKSHIRE_AND_THE_HUMBER,
        'Yorkshire',
        area
      )
    }

    template(bradfordPostcodes, 'Bradford')
    template(darlingtonPostcodes, 'Darlington')
    template(doncasterPostcodes, 'Doncaster')
    template(huddersfieldPostcodes, 'Huddersfield')
    template(harrogatePostcodes, 'Harrogate')
    template(hullPostcodes, 'Hull')
    template(halifaxPostcodes, 'Halifax')
    template(leedsPostcodes, 'Leeds')
    template(sheffieldPostcodes, 'Sheffield')
    template(wakefieldPostcodes, 'Wakefield')
    template(yorkPostcodes, 'York')
  })
})
