import requests
from argparse import ArgumentParser


parser = ArgumentParser()
parser.add_argument('-k', '--key', dest='key',
                    help='trello api key', required=True)
parser.add_argument('-t', '--token', dest='token',
                    help='trello api token', required=True)
parser.add_argument('-b', '--board_id', dest='board_id', action='append',
                    help='trello board short link', required=True)
parser.add_argument('-i', '--input_file', dest='input_file',
                    help='input file with trello ids', default='scripts/trello-numbers.txt')
parser.add_argument('-o', '--output_file', dest='output_file',
                    help='output file with trello description', default='scripts/trello-story-description.txt')


args = parser.parse_args()
payload = {'key': args.key, 'token': args.token}
short_link_ids = []
cards = []


# Fetch all cards from a trello board
for id in args.board_id:
    url = 'https://api.trello.com/1/boards/{id}/cards'.format(id=id)
    cards += requests.request('GET', url, params=payload).json()

print(cards)

# Fetch all trello short link ids from file
with open(args.input_file, 'r') as trello_links:
    for trello_link in trello_links:
        short_link_ids.append(trello_link.strip())


# Fetch trello description for a given list of trello short links
changes = [{'description': card['name'], 'url': card['url']} for card in cards if str(card['shortLink']) in short_link_ids]


# Create output file with the trello description
with open(args.output_file, 'w') as output_file:
    output_file.write('Changes: \n\n')
    for change in changes:
        output_file.write('{desc} (Change URL: {url}) \n\n'.format(url=change['url'],
            desc=change['description']))
