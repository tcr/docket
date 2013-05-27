# sudo pip install nltk egenix-mx-base
from nltk_contrib.timex import *
import sys

print(ground(tag(sys.argv[1]), gmt()))