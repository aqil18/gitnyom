import subprocess

res = ""
repo_url = ""
def runSemgrep(url, mode):
    global repo_url
    repo_url = url

    repo_name = url.split('/')[-1]

    if repo_name.endswith('.git'):
        repo_name = repo_name[:-4]

    clone_dir = cloneDir(repo_name)
    
    if mode == "pro":
        semgrepPro(clone_dir)
    else:
        semgrepBasic(clone_dir)

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

def semgrepBasic(clone_dir):
    command = ["semgrep", "scan", "--json", "--json-output=basic_output.json"]

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

#check this out make sure it works properly
def cloneDir(repo_name):
    clone_dir = f"/mnt/c/Users/hasan/OneDrive - UBC/Code Stuff/{repo_name}"

    print(clone_dir)    
    # Use subprocess to run git clone
    try:
        print("before")
        output = subprocess.check_output(["git", "clone", repo_url, clone_dir])
        print("here")
        for line in iter(output.stdout.readline, b''):
            decoded_line = line.decode()
            print(decoded_line, end='')  # Print to console
    except subprocess.CalledProcessError as e:
        print("Exception on process, rc=", e.returncode, "output=", e.output)

    return clone_dir

runSemgrep("https://github.com/ubccpsc/classportal_deprecated", "basic")
