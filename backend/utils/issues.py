import requests

def format_url(repo_url):
    api_url = repo_url.replace(
        'https://github.com', 'https://api.github.com/repos')
    api_url = f"{api_url}/issues"
    return api_url

def get_issues(url):
    formatted_url = format_url(url)
    response = requests.get(formatted_url)
    issues_data = []

    if response.status_code == 200:
        issues = response.json()
        for issue in issues:
             if issue.get('state') != 'closed':
                title = issue.get('title', 'No title')
                url = issue.get('url', 'No link available')
                labels = [
                    {'name': label['name'], 'color': label['color']} 
                    for label in issue.get('labels', [])
                ]
                
                # Add issue to the list if it is not closed
                issues_data.append({
                    'title': title,
                    'url': url,
                    'tags': labels if labels else ['No tags']
                })
    else:
        print(f"Failed to fetch issues: {response.status_code}")

    return issues_data
