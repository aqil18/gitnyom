import subprocess
import os
from typing import TypedDict
from .parse_output import parse_output

class SecurityResult(TypedDict):
    scan_summary: str
    scan_status: str
    code_findings: str

res = ""
repo_url = ""
clone_dir = ""
def runSemgrep(url, mode):
    global repo_url
    global clone_dir
    repo_url = url

    repo_name = url.split('/')[-1]

    if repo_name.endswith('.git'):
        repo_name = repo_name[:-4]

    clone_dir = cloneDir(repo_name)
    
    res = {}
    if mode == "pro":
        semgrepPro(clone_dir)
    else:
        res = semgrepBasic(clone_dir)

    return res


def semgrepPro(clone_dir):
    command = ["semgrep", "scan", "--pro" "--json", "--json-output=pro_output.json"]

    # Open a file to write the output in the clone directory
    output_file_path = f"{clone_dir}/pro_output.txt"
    with open(output_file_path, 'w') as output_file:
        # Run the command
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, cwd=clone_dir)

        # Print and save the output live
        for line in iter(process.stdout.readline, b''):
            decoded_line = line.decode()
            print(decoded_line, end='')  # Print to console
            output_file.write(decoded_line)  # Write to file

def semgrepBasic(clone_dir) -> SecurityResult:
    command = ["semgrep", "scan"]

    # Open a file to write the output
    output_file_path = f"{clone_dir}/basic_output.txt"
    with open(output_file_path, 'w') as output_file:
        # Run the command
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, cwd=clone_dir)

        # Print and save the output live
        for line in iter(process.stdout.readline, b''):
            decoded_line = line.decode()
            print(decoded_line, end='')  # Print to console
            output_file.write(decoded_line)  # Write to file

        process.stdout.close()
        process.wait()

    parse_output(output_file_path, clone_dir)
    final_output_names = ["scan_summary.txt", "scan_status.txt", "code_findings.txt"]

    res: SecurityResult = {"scan_summary": "", "scan_status": "", "code_findings": ""}
    for f in final_output_names:
        if not os.path.exists(f"{clone_dir}/{f}"):
            continue
        with open(f"{clone_dir}/{f}", 'r') as file:
            res[f.split('.')[0]] = file.read()
    
    return res

#check this out make sure it works properly
def cloneDir(repo_name):
    # Create repos directory if it doesn't exist
    if not os.path.exists("./repos"):
        os.makedirs("./repos")
        
    # Use relative path to current directory
    clone_dir = f"./repos/{repo_name}"

    print(clone_dir)    
    # Use subprocess to run git clone
    try:
        print("before")
        process = subprocess.Popen(["git", "clone", repo_url, clone_dir],
                                 stdout=subprocess.PIPE,
                                 stderr=subprocess.STDOUT)
        print("here")
        for line in iter(process.stdout.readline, b''):
            decoded_line = line.decode()
            print(decoded_line, end='')
            
        process.stdout.close()
        process.wait()
    except subprocess.CalledProcessError as e:
        print("Exception on process, rc=", e.returncode, "output=", e.output)

    return clone_dir

def get_security_analysis(url: str):
    return runSemgrep(url, "basic")
