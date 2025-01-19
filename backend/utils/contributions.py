import requests
import matplotlib.pyplot as plt
from urllib.parse import urlparse
import os
from dotenv import load_dotenv

load_dotenv('.env')
token = os.getenv('TOKEN')

def format_url(repo_url):
    api_url = repo_url.replace(
        'https://github.com', 'https://api.github.com/repos')
    api_url = f"{api_url}/stats/contributors"
    return api_url

def get_commit_activity(repo_url):
    formatted_url = format_url(repo_url)
    print(formatted_url)
    # Headers for the request
    # headers = {"Accept": "application/vnd.github+json",
        #    "Authorization": f"Token {token}"}

    # Make the API request
    response = requests.get(formatted_url)
    if response.status_code == 202:
        print("GitHub is processing the statistics. Please try again in a few moments.")
        return None
    elif response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}, {response.text}")

    data = response.json()
    total_commits_count = sum([contributor['total'] for contributor in data])
    contributors_data = []

    for contributor in data:
        contributors_data.append({
            "name": contributor['author']['login'],
            "commits": contributor['total'],
            "percentage": (contributor['total'] / total_commits_count) * 100
        })

    return contributors_data

def visualize_commit_activity(repo_url):
    contributors_data = get_commit_activity(repo_url)
    if not contributors_data:
        return

    # Extract data for plotting
    labels = [contributor['name'] for contributor in contributors_data]
    sizes = [contributor['commits'] for contributor in contributors_data]

    # Plot the pie chart
    plt.figure(figsize=(10, 10))
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140)
    plt.title("Commit Distribution Among Contributors (with Commit Numbers)")
    plt.axis("equal")  # Equal aspect ratio ensures the pie is drawn as a circle
    plt.show()

if __name__ == "__main__":
    repo_url = input("Enter the GitHub repository URL: ")
    visualize_commit_activity(repo_url)
