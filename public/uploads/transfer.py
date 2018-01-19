import urllib
import requests
import argparse
parser = argparse.ArgumentParser(description='Optional app description')
parser.add_argument('--file',help='The path to the file you want to transfer')
parser.add_argument('--server',help='The IP address or domain name of the server')
args = parser.parse_args()
response = urllib.urlopen(args.server).read()
files = {'file': open(args.file, 'rb')}
r = requests.post(args.server+"/receive", files=files)
print(r.text)

