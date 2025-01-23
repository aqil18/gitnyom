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
1. Provides a security scan produced by semantic analysis of all security vulnerabilities in the repo
2. Example output:
```
┌─────────────┐
│ Scan Status │
└─────────────┘
  Scanning 84 files tracked by git with 2045 Code rules:

  Language      Rules   Files          Origin      Rules
 ─────────────────────────────        ───────────────────
  <multilang>      61      81          Community    1058
  js              261      32          Pro rules     987
  ts              271      24
  json              4      11
  bash              4       1
  html              1       1



┌──────────────┐
│ Scan Summary │
└──────────────┘
Some files were skipped or only partially analyzed.
  Scan was limited to files tracked by git.
  Partially scanned: 37 files only partially analyzed due to parsing or internal Semgrep errors
  Scan skipped: 3 files matching .semgrepignore patterns
  For a full list of skipped files, run semgrep with the --verbose flag.

Ran 339 rules on 81 files: 8 findings.


┌─────────────────┐
│ 8 Code Findings │
└─────────────────┘

    frontend/modules/admin_portal/autotest_view/DataParser.js
   ❯❯❱ javascript.browser.security.insecure-document-method.insecure-document-method
          User controlled data in methods like `innerHTML`, `outerHTML` or `document.write` is an anti-pattern
          that can lead to XSS vulnerabilities
          Details: https://sg.run/LwA9

          267┆ document.getElementById('bucket' + i).innerHTML = myData[i] + ' of ' + totalProjects + ' (
               ' + perc + ' )';
            ⋮┆----------------------------------------
          271┆ document.getElementById('bucketAvg').innerHTML = (total / totalProjects ).toFixed(1) + ' (
               # ' + totalProjects + ' )';
            ⋮┆----------------------------------------
          278┆ document.getElementById('bucketMedian').innerHTML = median;
            ⋮┆----------------------------------------
          279┆ document.getElementById('bucketPassing').innerHTML = numPassing;
            ⋮┆----------------------------------------
          280┆ document.getElementById('bucketFailing').innerHTML = numFailing;

    frontend/public/index.html
    ❯❱ html.security.audit.missing-integrity.missing-integrity
          This tag is missing an 'integrity' subresource integrity attribute. The 'integrity' attribute allows
          for the browser to verify that externally hosted files (for example from a CDN) are delivered
          without unexpected manipulation. Without this attribute, if an attacker can modify the externally
          hosted resource, this could lead to XSS and other types of attacks. To prevent this, include the
          base64-encoded cryptographic hash of the resource (file) you’re telling the browser to fetch in the
          'integrity' attribute for all externally hosted files.
          Details: https://sg.run/krXA

           11┆ <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

    src/batch/GradeExporter.ts
    ❯❱ javascript.lang.security.audit.incomplete-sanitization.incomplete-sanitization
          `txt.replace` method will only replace the first occurrence when used with a string argument ('[').
          If this method is used for escaping of dangerous data then there is a possibility for a bypass. Try
          to use sanitization library instead or use a Regex with a global flag.
          Details: https://sg.run/1GbQ

          120┆ txt = txt.replace('[', '');
            ⋮┆----------------------------------------
    ❯❱ javascript.lang.security.audit.incomplete-sanitization.incomplete-sanitization
          `txt.replace` method will only replace the first occurrence when used with a string argument (']').
          If this method is used for escaping of dangerous data then there is a possibility for a bypass. Try
          to use sanitization library instead or use a Regex with a global flag.
          Details: https://sg.run/1GbQ

          121┆ txt = txt.replace(']', '');
```

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
