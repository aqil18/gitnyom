from gitingest import ingest

# summary, tree, content = ingest("path/to/directory")

# or from URL
summary, tree, content = ingest("https://github.com/aqil18/fully-self-driving-Pi")

print(summary)
print(tree)
print(content)