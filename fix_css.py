with open("src/index.css", "r") as f:
    text = f.read()

text = text.replace("min-height: 100dvh;", "height: 100%;")
text = text.replace("min-height: 100%;", "height: 100%;")
text = text.replace("overscroll-behavior-y: none;", "")

with open("src/index.css", "w") as f:
    f.write(text)
