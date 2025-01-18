from gitingest import ingest
from colorama import Fore
# summary, tree, content = ingest("path/to/directory")

# or from URL -> input a test repo URL
summary, tree, content = ingest("https://github.com/aqil18/fully-self-driving-Pi")

print(Fore.YELLOW + "\n\n\n SUMMARY: ")
print(Fore.WHITE + summary)

print(Fore.YELLOW + "\n\n\n TREE: ")
print(Fore.WHITE + tree)

print(Fore.YELLOW + "\n\n\n CONTENT: ")
print(Fore.WHITE + content)