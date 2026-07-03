with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('className={`h-screen overflow-hidden flex flex-col', 'className={`fixed inset-0 flex flex-col')

with open("src/App.tsx", "w") as f:
    f.write(text)
