import requests
import matplotlib.pyplot as plt
from urllib.parse import urlparse
import os
from dotenv import load_dotenv

load_dotenv('.env')

def get_commit_activity(repo_url):
    # Parse the repository URL to extract owner and repo
    parsed_url = urlparse(repo_url)
    path_parts = parsed_url.path.strip("/").split("/")
    if len(path_parts) != 2:
        raise ValueError("Invalid GitHub repository URL")
    owner, repo = path_parts

    # API URL
    api_url = f"https://api.github.com/repos/{owner}/{repo}/stats/contributors"


    # Headers for the request
    headers = {"Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {os.environ.get('TOKEN')}"  # Add token here
    }

    # Make the API request
    response = requests.get(api_url, headers=headers)
    if response.status_code == 202:
        print("GitHub is processing the statistics. Please try again in a few moments.")
        return None
    elif response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}, {response.text}")

    return response.json()

def visualize_commit_activity(repo_url):
    data = get_commit_activity(repo_url)
    if not data:
        return

    # Prepare data for visualization
    contributors = []
    total_commits = []

    for contributor in data:
        contributors.append(f"{contributor['author']['login']} ({contributor['total']} commits)")
        total_commits.append(contributor["total"])

    # Plot the pie chart
    plt.figure(figsize=(10, 10))
    plt.pie(total_commits, labels=contributors, autopct='%1.1f%%', startangle=140)
    plt.title("Commit Distribution Among Contributors (with Commit Numbers)")
    plt.axis("equal")  # Equal aspect ratio ensures the pie is drawn as a circle
    plt.show()

if __name__ == "__main__":
    repo_url = input("Enter the GitHub repository URL: ")
    visualize_commit_activity(repo_url)
