with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('className="h-full"\n            >', 'className="w-full min-h-full flex flex-col"\n            >')

with open("src/App.tsx", "w") as f:
    f.write(text)
