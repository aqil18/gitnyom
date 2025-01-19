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
async def root():
    contributions = utils.contributions.get_commit_activity('https://github.com/supabase/supabase')
    response = utils.issues.get_issues('https://github.com/supabase/supabase')
    fs = utils.text_dump.get_file_structure('https://github.com/supabase/supabase')
    security = utils.runSemgrep.get_security_analysis('https://github.com/ubccpsc/classportal_deprecated')
    # summary, tree, content = ingest('https://github.com/supabase/supabase')
    # utils.text_dump.summary(summary, tree, content)
    # resume_summary = utils.resume.generate_description(summary + tree + content)
    return {'contributions': contributions, 'issues': response, 'file_structure': fs, 'security': security}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
