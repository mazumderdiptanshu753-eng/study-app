import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the useEffect for loading users from Firebase (around lines 65-75)
content = re.sub(r'// Load users from Firebase\s*useEffect\(\(\) => \{\s*import\(\"./lib/firebase\"\).*?\}\);\s*\}, \[\]\);', '', content, flags=re.DOTALL)

# Remove the save to firebase block
content = re.sub(r'// Send to Firebase database\s*import\(\"./lib/firebase\"\)\.then\(\(\{ db \}\) => \{\s*import\(\"firebase/firestore\"\)\.then\(\(\{ doc, setDoc \}\) => \{\s*setDoc\(.*?\)\s*\.catch\(.*?\);\s*\}\);\s*\}\);', '', content, flags=re.DOTALL)

# Remove the update to firebase block
content = re.sub(r'// Send to Firebase database\s*import\(\"./lib/firebase\"\)\.then\(\(\{ db \}\) => \{\s*import\(\"firebase/firestore\"\)\.then\(\(\{ doc, updateDoc \}\) => \{\s*updateDoc\(.*?\)\s*\.catch\(.*?\);\s*\}\);\s*\}\);', '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
