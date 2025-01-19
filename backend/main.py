from fastapi import FastAPI
import uvicorn
import utils

import utils.contributions
import utils.issues
import utils.resume
import utils.text_dump
import utils.runSemgrep

app = FastAPI()


@app.get("/")
async def root(repo_url: str = 'https://github.com/ubccpsc/classportal_deprecated'):
    contributions = utils.contributions.get_commit_activity(repo_url)
    response = utils.issues.get_issues(repo_url)
    fs = utils.text_dump.get_file_structure(repo_url)
    security = utils.runSemgrep.get_security_analysis(repo_url)
    return {'contributions': contributions, 'issues': response, 'file_structure': fs, 'security': security}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
