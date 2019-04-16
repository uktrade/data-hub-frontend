import requests
from argparse import ArgumentParser


parser = ArgumentParser()
parser.add_argument('-k', '--key', dest='key',
                    help='trello api key', required=True)
parser.add_argument('-t', '--token', dest='token',
                    help='trello api token', required=True)
parser.add_argument('-b', '--board_id', dest='board_id',
                    help='trello board id', required=True)
parser.add_argument('-i', '--input_file', dest='input_file',
                    help='input file with trello ids', default='scripts/trello-numbers.txt')
parser.add_argument('-o', '--output_file', dest='output_file',
                    help='output file with trello description', default='scripts/trello-story-description.txt')

args = parser.parse_args()
short_ids = []

# Trello api endpoint for all cards for a given board
payload = {'key': args.key, 'token': args.token}
url = 'https://api.trello.com/1/boards/{board_id}/cards'.format(board_id=args.board_id)


# Fetch all cards from a trello board
cards = requests.request('GET', url, params=payload).json()


# Store all trello short ids from file
with open(args.input_file, 'r') as trello_ids:
    for trello_id in trello_ids:
        short_ids.append(trello_id.strip())


# Fetch trello description for a given list of trello ids
cards_desc = [{'name': card['name'], 'trello_id': str(card['idShort'])} for card in cards if str(card['idShort']) in short_ids]


# Create output file with the trello description
with open(args.output_file, 'w') as output_file:
    output_file.write('Trello Description: \n')
    for card_desc in cards_desc:
        output_file.write('{desc} (Trello ID: {id}) \n'.format(id=card_desc['trello_id'],
            desc=card_desc['name']))
