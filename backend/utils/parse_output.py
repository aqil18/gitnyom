import os

def clean_text(text):
    """
    Removes box-drawing characters and cleans up the text.
    """
    # List of box-drawing characters to remove
    box_chars = '└─┘├┤┌┐│'
    
    # Remove box characters
    for char in box_chars:
        text = text.replace(char, '')
    
    # Remove any extra whitespace that might be left
    return text.strip()

def clean_section_title(line):
    """
    Removes box-drawing characters only from section titles.
    """
    # List of box-drawing characters to remove
    box_chars = '└─┘├┤┌┐│'
    
    # Only clean if it's a section title line
    if any(title in line for title in ["Scan Summary", "Scan Status", "Code Findings"]):
        for char in box_chars:
            line = line.replace(char, '')
        return line.strip()
    return line

def parse_sections(text):
    """
    Parses the input text into sections based on specific section titles.
    Returns a dictionary with section titles as keys and content as values.
    """
    sections = {}
    current_section = None
    section_content = []
    
    # Define the section titles we're looking for
    section_titles = ["Scan Summary", "Scan Status", "Code Findings"]
    
    # Clean the text first
    text = clean_text(text)
    
    for line in text.split('\n'):
        # Clean only section title lines
        cleaned_line = clean_section_title(line)
        
        # Check if line contains a section title
        for title in section_titles:
            if title in cleaned_line:
                # If we were building a previous section, save it
                if current_section:
                    sections[current_section] = '\n'.join(section_content)
                    section_content = []
                current_section = title
                break
        else:
            # If we're in a section, add the original (uncleaned) line to current content
            if current_section:
                section_content.append(line)
    
    # Don't forget to save the last section
    if current_section and section_content:
        sections[current_section] = '\n'.join(section_content)
    
    return sections

def save_sections_to_files(sections, output_dir):
    """
    Saves each section to a separate file with specific naming in the specified directory.
    
    Args:
        sections (dict): Dictionary containing section names and their content
        output_dir (str): Directory path where files should be saved
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    for section_name, content in sections.items():
        # Create a filename-safe version of the section name
        safe_name = section_name.lower().replace(' ', '_')
        filename = os.path.join(output_dir, f"{safe_name}.txt")
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

def parse_output(input_file, output_dir):
    """
    Main function to parse semgrep output and save sections to files.
    
    Args:
        input_file (str): Path to the input file to parse
        output_dir (str): Directory path where output files should be saved
    """
    # Read the input file with UTF-8 encoding
    with open(input_file, 'r', encoding='utf-8') as f:
        input_text = f.read()
    
    # Parse the sections
    sections = parse_sections(input_text)
    
    # Save to files
    save_sections_to_files(sections, output_dir)
    