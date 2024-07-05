import { UK_REGIONS } from '../../../../../common/constants'
import { POSTCODE_REGEX } from './constants'

const POSTCODE_AREA_TO_REGION = {
  AB: UK_REGIONS.SCOTLAND, // Aberdeen
  AL: UK_REGIONS.EAST_OF_ENGLAND, // St. Albans
  B: UK_REGIONS.WEST_MIDLANDS, // Birmingham
  BA: UK_REGIONS.SOUTH_WEST, // Bath
  BB: UK_REGIONS.NORTH_WEST, // Blackburn
  BD: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Bradford
  BH: UK_REGIONS.SOUTH_WEST, // Bournemouth
  BL: UK_REGIONS.NORTH_WEST, // Bolton
  BN: UK_REGIONS.SOUTH_EAST, // Brighton
  BR: UK_REGIONS.SOUTH_EAST, // Bromley
  BS: UK_REGIONS.SOUTH_WEST, // Bristol
  BT: UK_REGIONS.NORTHERN_IRELAND, // Belfast
  CA: UK_REGIONS.NORTH_WEST, // Carlisle
  CB: UK_REGIONS.EAST_OF_ENGLAND, // Cambridge
  CF: UK_REGIONS.WALES, // Cardiff
  CH: UK_REGIONS.NORTH_WEST, // Chester
  CM: UK_REGIONS.EAST_OF_ENGLAND, // Chelmsford
  CO: UK_REGIONS.EAST_OF_ENGLAND, // Colchester
  CR: UK_REGIONS.LONDON, // Croydon
  CT: UK_REGIONS.SOUTH_EAST, // Canterbury
  CV: UK_REGIONS.WEST_MIDLANDS, // Coventry
  CW: UK_REGIONS.NORTH_WEST, // Crewe
  DA: UK_REGIONS.SOUTH_EAST, // Dartford
  DD: UK_REGIONS.SCOTLAND, // Dundee
  DE: UK_REGIONS.EAST_MIDLANDS, // Derby
  DG: UK_REGIONS.SCOTLAND, // Dumfries (and Galloway)
  DH: UK_REGIONS.NORTH_EAST, // Durham
  DL: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Darlington
  DN: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Doncaster
  DT: UK_REGIONS.SOUTH_WEST, // Dorchester
  DY: UK_REGIONS.WEST_MIDLANDS, // Dudley
  E: UK_REGIONS.LONDON, // East London
  EC: UK_REGIONS.LONDON, // East Central London
  EH: UK_REGIONS.SCOTLAND, // Edinburgh
  EN: UK_REGIONS.LONDON, // Enfield
  EX: UK_REGIONS.SOUTH_WEST, // Exeter
  FK: UK_REGIONS.SCOTLAND, // Falkirk
  FY: UK_REGIONS.NORTH_WEST, // The Fylde (Blackpool)
  G: UK_REGIONS.SCOTLAND, // Glasgow
  GL: UK_REGIONS.SOUTH_WEST, // Gloucester
  GU: UK_REGIONS.SOUTH_EAST, // Guildford
  HA: UK_REGIONS.LONDON, // Harrow
  HD: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Huddersfield
  HG: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Harrogate
  HP: UK_REGIONS.EAST_OF_ENGLAND, // Hemel Hempstead
  HR: UK_REGIONS.WEST_MIDLANDS, // Hereford
  HS: UK_REGIONS.SCOTLAND, // The Hebrides
  HU: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Hull
  HX: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Halifax
  IG: UK_REGIONS.LONDON, // Ilford
  IP: UK_REGIONS.EAST_OF_ENGLAND, // Ipswich
  IV: UK_REGIONS.SCOTLAND, // Inverness
  KA: UK_REGIONS.SCOTLAND, // Kilmarnock
  KT: UK_REGIONS.LONDON, // Kingston Upon Thames
  KW: UK_REGIONS.SCOTLAND, // Kirkwall (Orkney Islands)
  KY: UK_REGIONS.SCOTLAND, // Kirkcaldy
  L: UK_REGIONS.NORTH_WEST, // Liverpool
  LA: UK_REGIONS.NORTH_WEST, // Lancaster
  LD: UK_REGIONS.WALES, // Llandrindod Wells
  LE: UK_REGIONS.EAST_MIDLANDS, // Leicester
  LL: UK_REGIONS.WALES, // Llandudno
  LN: UK_REGIONS.EAST_MIDLANDS, // Lincoln
  LS: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Leeds
  LU: UK_REGIONS.EAST_OF_ENGLAND, // Luton
  M: UK_REGIONS.NORTH_WEST, // Manchester
  ME: UK_REGIONS.SOUTH_EAST, // Medway
  MK: UK_REGIONS.SOUTH_EAST, // Milton Keynes
  ML: UK_REGIONS.SCOTLAND, // Motherwell
  N: UK_REGIONS.LONDON, // North London
  NE: UK_REGIONS.NORTH_EAST, // Newcastle Upon Tyne
  NG: UK_REGIONS.EAST_MIDLANDS, // Nottingham
  NN: UK_REGIONS.EAST_MIDLANDS, // Northampton
  NP: UK_REGIONS.WALES, // Newport
  NR: UK_REGIONS.EAST_OF_ENGLAND, // Norwich
  NW: UK_REGIONS.LONDON, // North West London
  OL: UK_REGIONS.NORTH_WEST, // Oldham
  OX: UK_REGIONS.SOUTH_EAST, // Oxford
  PA: UK_REGIONS.SCOTLAND, // Paisley
  PE: UK_REGIONS.EAST_OF_ENGLAND, // Peterborough
  PH: UK_REGIONS.SCOTLAND, // Perth
  PL: UK_REGIONS.SOUTH_WEST, // Plymouth
  PO: UK_REGIONS.SOUTH_EAST, // Portsmouth
  PR: UK_REGIONS.NORTH_WEST, // Preston
  RG: UK_REGIONS.SOUTH_EAST, // Reading
  RH: UK_REGIONS.SOUTH_EAST, // Redhill
  RM: UK_REGIONS.LONDON, // Romford
  S: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Sheffield
  SA: UK_REGIONS.WALES, // Swansea
  SE: UK_REGIONS.LONDON, // South East London
  SG: UK_REGIONS.EAST_OF_ENGLAND, // Stevenage
  SK: UK_REGIONS.NORTH_WEST, // Stockport
  SL: UK_REGIONS.SOUTH_EAST, // Slough
  SM: UK_REGIONS.LONDON, // Sutton (and Morden)
  SN: UK_REGIONS.SOUTH_WEST, // Swindon
  SO: UK_REGIONS.SOUTH_EAST, // Southampton
  SP: UK_REGIONS.SOUTH_WEST, // Salisbury (Salisbury Plain)
  SR: UK_REGIONS.NORTH_EAST, // Sunderland
  SS: UK_REGIONS.EAST_OF_ENGLAND, // Southend-On-Sea
  ST: UK_REGIONS.WEST_MIDLANDS, // Stoke-On-Trent
  SW: UK_REGIONS.LONDON, // South West London
  SY: UK_REGIONS.WEST_MIDLANDS, // Shrewsbury
  TA: UK_REGIONS.SOUTH_WEST, // Taunton
  TD: UK_REGIONS.SCOTLAND, // Tweeddale (Galashiels)
  TF: UK_REGIONS.WEST_MIDLANDS, // Telford
  TN: UK_REGIONS.SOUTH_EAST, // Tunbridge Wells
  TQ: UK_REGIONS.SOUTH_WEST, // Torquay
  TR: UK_REGIONS.SOUTH_WEST, // Truro
  TS: UK_REGIONS.NORTH_EAST, // Teesside
  TW: UK_REGIONS.LONDON, // Twickenham
  UB: UK_REGIONS.LONDON, // Uxbridge (Southall)
  W: UK_REGIONS.LONDON, // West London
  WA: UK_REGIONS.NORTH_WEST, // Warrington
  WC: UK_REGIONS.LONDON, // West Central London
  WD: UK_REGIONS.EAST_OF_ENGLAND, // Watford
  WF: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // Wakefield
  WN: UK_REGIONS.NORTH_WEST, // Wigan
  WR: UK_REGIONS.WEST_MIDLANDS, // Worcester
  WS: UK_REGIONS.WEST_MIDLANDS, // Walsall
  WV: UK_REGIONS.WEST_MIDLANDS, // Wolverhampton
  YO: UK_REGIONS.YORKSHIRE_AND_THE_HUMBER, // York
  ZE: UK_REGIONS.SCOTLAND, // Zetland (Shetland Islands)
}

export const mapPostcodeToRegion = (postcode) => {
  if (postcode === undefined || !POSTCODE_REGEX.test(postcode)) {
    return ''
  } else {
    const postcodeNoSpace = postcode.replace(/\s/g, '')
    const outcode = postcodeNoSpace.slice(0, -3)
    // The longest postcode district is three characters
    // Exceptions are to accomodate one-character outcodes
    if (
      outcode.length < 3 &&
      Array.from(outcode)[0].toUpperCase() != 'E' &&
      Array.from(outcode)[0].toUpperCase() != 'N' &&
      Array.from(outcode)[0].toUpperCase() != 'W' &&
      Array.from(outcode)[0].toUpperCase() != 'L' &&
      Array.from(outcode)[0].toUpperCase() != 'M' &&
      Array.from(outcode)[0].toUpperCase() != 'S' &&
      Array.from(outcode)[0].toUpperCase() != 'G' &&
      Array.from(outcode)[0].toUpperCase() != 'B'
    ) {
      return postcode
    }
    const area = outcode.split(outcode.match(/\d+/)[0])[0]
    return POSTCODE_AREA_TO_REGION[area]
  }
}
