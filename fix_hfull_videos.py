import re

with open("src/components/VideoPortal.tsx", "r") as f:
    text = f.read()

text = text.replace('className="h-full"', 'className="w-full"')

with open("src/components/VideoPortal.tsx", "w") as f:
    f.write(text)
