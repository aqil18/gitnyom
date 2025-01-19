from fastapi import FastAPI
import uvicorn
import utils
from gitingest import ingest

import utils.contributions
import utils.issues
import utils.resume
import utils.text_dump

app = FastAPI()


@app.get("/")
async def root():
    contributions = utils.contributions.get_commit_activity('https://github.com/supabase/supabase')
    response = utils.issues.get_issues('https://github.com/supabase/supabase')
    # summary, tree, content = ingest('https://github.com/supabase/supabase')
    # utils.text_dump.summary(summary, tree, content)
    # resume_summary = utils.resume.generate_description(summary + tree + content)
    return {'contributions': contributions, 'issues': response, 'file_structure': resume_summary}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
