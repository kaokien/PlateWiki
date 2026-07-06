import os

src_dir = r"c:\Documents-Fuck Microsoft\BoxingWiki\src"
noindex_matches = []

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'noindex' in content or 'index: false' in content:
                        noindex_matches.append((path, file))
            except Exception as e:
                pass

print("Found noindex matches:")
for path, file in noindex_matches:
    print(f"- {path}")
