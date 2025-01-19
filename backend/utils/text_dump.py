import requests
from typing import TypedDict, List, Optional, Union

class FileStructure(TypedDict):
    name: str
    path: str
    url: str
    type: str  # Common field for both File and Directory

class File(FileStructure):
    type: str  # "file" (specific to files)


class Directory(FileStructure):
    type: str  # "dir" (specific to directories)
    contents: List[Union["File", "Directory"]]  # Composite structure

def build_structure(node: dict[str, dict], current_path: str) -> FileStructure:
    components = current_path.split("/")
    dir_name = current_path.split("/")[-1] if current_path else "root"
    if len(components) == 1:

    directory: Directory = Directory(name=dir_name, path=current_path or "/")

    for name, child in node.items():
        child_path = f"{current_path}/{name}".strip("/")
        if child:  # It's a directory
            directory.contents.append(build_structure(child, child_path))
        else:  # It's a file
            directory.contents.append(File(name=name, path=child_path, url=f"https://example.com/{child_path}"))
    return directory

def get_file_structure(url: str) -> FileStructure | None:
    api_url = url.replace(
        'https://github.com', 'https://api.github.com/repos')
    
    response = requests.get(api_url)
    if response.status_code == 202:
        print("GitHub is processing the statistics. Please try again in a few moments.")
        return None
    elif response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}, {response.text}")

    data = response.json()
    if 'tree' not in data:
        raise Exception("The repository does not have a tree structure.")

    root = {}
    for path in data['tree']:
        parts = path.strip("/").split("/")
        current = root
        for part in parts:
            if part not in current:
                current[part] = {}
            current = current[part]
