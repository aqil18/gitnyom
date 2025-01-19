![title](/screenshots/title.png)

## What it does?
Think Spotify Wrapped but for code.Throw us a GitHub repo URL and get beautiful visualizations of any repo's stats, contributors, structure, and security vulnerabilities. 

## Curious to learn more?
Read more about our project on our devpost -> https://devpost.com/software/git-nyom

## Feature list
- General Summary
1. Search bar to find the repo you want to analyse
2. AI summary of the entire repo and its purpose
3. Pie chart on repo contributions
4. Issues on the repo sorted by priority and labled by how beginner friendly issues are
___
- Anatomy
1. Shows a full 3D Graph of the file structure
2. Provides a summary of each file on click of a node
___
- Security (Under Development)
1. Provides a security scan produced by Semgrep of all security vulnerabilities in the repo

## Demo Videos
### Full walkthrough of our project

https://github.com/user-attachments/assets/ee0a4740-9af6-40c1-9d04-b6f0a29a7444

### More in depth view of the 3D file structure built with D3, 3Js and Orbital Controls

https://github.com/user-attachments/assets/3924c420-c3bc-41eb-b776-c5a8793c47ee

## How to setup
### 3d-file-tree
1. npm i
2. npx http-server .
- To access: http://localhost:8080/
- Note: To load new scripts use Command+Shift+R and delete cached scripts.

### frontend
1. npm i
2. npm run dev
- To access: http://localhost:3000/

### backend 
1. python3 -m venv .venv
2. source .venv/bin/activate
3. pip3 install -r requirements.txt
4. fastapi dev main.py (if successful)
- To access: http://localhost:8000/?repo_url=https://github.com/arunbhardwaj/LeetHub-2.0
- Note: Update the URL according to the repo to retrieve.
