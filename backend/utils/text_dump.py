from os import name
import requests
from typing import TypedDict, List, Optional, Union, cast

class FileStructure(TypedDict):
    name: str
    path: str
    url: str
    type: str  # "blob" | Tree (specific to files)

class File(FileStructure):
    type: str  # "blob" (specific to files)


class Directory(FileStructure):
    type: str  # "tree" (specific to directories)
    contents: List[Union["File", "Directory"]]  # Composite structure

def get_file_structure(url: str) -> Optional[FileStructure]:
    api_url = url.replace(
        'https://github.com', 'https://api.github.com/repos')
    
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}, {response.text}")

    data = response.json()
    if 'default_branch' not in data:
        raise Exception("The repository does not have a default branch.")

    api_url = f"{api_url}/git/trees/{data['default_branch']}?recursive=1"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}, {response.text}")

    data = response.json()
    if 'tree' not in data:
        raise Exception("The repository does not have a tree structure.")

    root: Directory = {"name": "root", "path": "", "url": "", "type": "tree", "contents": []}
    fss: dict[str, FileStructure] = {}
    for pathObj in data['tree']:
        path = pathObj['path']
        fss[path] = {"name": path, "path": path, "url": pathObj['url'], "type": pathObj['type']}
        if pathObj['type'] == 'tree':
            fss[path] = cast(Directory, {**fss[path], "contents": []})

    
    for pathObj in data['tree']:
        path = pathObj['path']
        parts = path.strip("/").split("/")
        if len(parts) == 1:
            root["contents"].append(fss[path])
            continue

        parent = cast(Directory, fss["/".join(parts[:-1])])
        parent["contents"].append(fss[path])

    return root
