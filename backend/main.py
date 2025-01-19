from fastapi import FastAPI
import uvicorn
from .utils import ai, contributions

app = FastAPI()

@app.get("/")
def root():
    return {'message': 'Welcome to Gitify!'}


@app.get("/resume_points")
async def generate_description():
    print('hello')
    text = open("example_repo.txt").read()
    description = ai.generate_description(text)
    return {"resume_points": description}


@ app.get('/contributors')
async def get_contributors():
    return contributions.get_commit_activity()

@app.get('/summary')
def summary():
    issues = ""
    return {'summary': [],
            'chart': [],
            'issues': {
                'title': issues.title(),
                'tags': issues.tags()
    }
    }

@app.get('/anatomy')
def graph():
    component = ""
    return {'name': component.name(), "type": component.class_type()}


@app.get('/security')
def security():
    return {'message': 'hello security'}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
