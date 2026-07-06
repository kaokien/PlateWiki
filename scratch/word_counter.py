import os
import re

print("Word counter script started...")

BANNED_WORDS = [
    "delve", "tapestry", "seamless", "multifaceted", "testament", "robust", 
    "landscape", "journey", "elevate", "empower", "streamline", "leverage", 
    "utilize", "furthermore", "moreover", "notably"
]

TARGET_IDS = [
    "corner-instructions-mid-fight",
    "how-to-fight-an-inside-pressure-fighter",
    "southpaw-stance-mechanics",
    "countering-the-jab",
    "lateral-movement-defense",
    "boxing-shadowboxing-workouts",
    "boxing-fat-loss-muscle-retention",
    "boxing-defensive-guard-styles",
    "defending-the-uppercut",
    "boxing-angles-for-power-shots"
]

def check_file(filepath):
    print(f"Checking: {filepath}")
    if not os.path.exists(filepath):
        print("  File does not exist.")
        return
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Strip frontmatter
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            body = parts[2]
            
    # Count words (simple split)
    words = body.split()
    word_count = len(words)
    
    # Find banned words (case insensitive)
    found_banned = []
    for word in BANNED_WORDS:
        pattern = re.compile(rf"\b{word}\b", re.IGNORECASE)
        matches = pattern.findall(body)
        if matches:
            found_banned.append((word, len(matches)))
            
    # Check for rule-of-three list pattern: word, word, and word
    rule_of_three_pattern = re.compile(r"\b\w+,\s+\w+,\s+and\s+\w+\b", re.IGNORECASE)
    rule_of_three_matches = rule_of_three_pattern.findall(body)
    
    print(f"File: {os.path.basename(filepath)}")
    print(f"  Word Count (body): {word_count}")
    if found_banned:
        print(f"  BANNED WORDS FOUND: {found_banned}")
    else:
        print("  No banned words found.")
    if rule_of_three_matches:
        print(f"  POSSIBLE RULE OF THREE FOUND: {rule_of_three_matches}")
    else:
        print("  No rule-of-three patterns found.")
    print("-" * 40)

if __name__ == "__main__":
    articles_dir = r"c:\Documents-Fuck Microsoft\BoxingWiki\content\articles"
    print(f"Articles directory: {articles_dir}")
    for target_id in TARGET_IDS:
        check_file(os.path.join(articles_dir, f"{target_id}.md"))
