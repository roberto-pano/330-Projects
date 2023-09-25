import sys
import os
import re
import operator


player_dict = {}

player_stat = []

def parse(file_line):
    player_regex = re.compile(r'(?P<player_first>[\w\.]+) (?P<player_last>[\w\.]+) batted (?P<num_bats>\d) times with (?P<num_hits>\d) hits and (?P<num_runs>\d) runs')
    match = player_regex.match(file_line)
    if match is not None:
        player = match.group('player_first') + ' ' + match.group('player_last')
        if(player not in player_dict):
            player_dict[player] = [int(match.group('num_bats')), int(match.group('num_hits'))]
        elif player in player_dict:
            player_dict[player] = [int(match.group('num_bats')) + player_dict[player][0], int(match.group('num_hits')) + player_dict[player][1]]
        

if len(sys.argv) < 2:
    sys.exit(f"Usage: {sys.argv[0]} filename")
filename = sys.argv[1]  
if not os.path.exists(filename):
    sys.exit(f"Error: File '{sys.argv[1]}' not found")

with open(filename, 'r') as f:
    for line in f:
        parse(line)
         
for player in player_dict:
    average = player_dict[player][1]/player_dict[player][0]
    player_stat.append([player,average])
player_stat = sorted(player_stat, key = operator.itemgetter(1), reverse = True)
for i in range(len(player_stat)):
    print(str(player_stat[i][0]) + ': ' + "%.3f" % player_stat[i][1])