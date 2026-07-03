with open("src/index.css", "r") as f:
    text = f.read()

text = text.replace("-webkit-overflow-scrolling: touch;", "")

with open("src/index.css", "w") as f:
    f.write(text)
