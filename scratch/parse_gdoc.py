import re
import sys
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.in_style = False
        self.in_script = False

    def handle_starttag(self, tag, attrs):
        if tag == 'style':
            self.in_style = True
        elif tag == 'script':
            self.in_script = True

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False
        elif tag == 'script':
            self.in_script = False

    def handle_data(self, data):
        if not self.in_style and not self.in_script:
            self.result.append(data)

def extract_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip everything before --- if any
    parts = content.split('---', 1)
    html_content = parts[1] if len(parts) > 1 else content
    
    parser = HTMLTextExtractor()
    parser.feed(html_content)
    text = ''.join(parser.result)
    
    # Clean up whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = re.sub(r' +', ' ', text)
    return text

if __name__ == '__main__':
    path = r"C:\Users\kevin\.gemini\antigravity\brain\069f8482-b356-448f-9001-f83f6b4f869a\.system_generated\steps\11804\content.md"
    clean_text = extract_text(path)
    # Output first 10000 characters or write to a text file
    with open("scratch/clean_gdoc.txt", "w", encoding="utf-8") as out:
        out.write(clean_text)
    print("Parsed content written to scratch/clean_gdoc.txt. Length:", len(clean_text))
