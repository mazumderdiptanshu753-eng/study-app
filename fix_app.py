with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('className={`h-[100dvh] flex flex-col ${theme.bgPage}', 'className={`h-screen overflow-hidden flex flex-col ${theme.bgPage}')

with open("src/App.tsx", "w") as f:
    f.write(text)
