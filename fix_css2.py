with open("src/index.css", "r") as f:
    text = f.read()

text = text.replace("overflow-x: hidden;", "overflow: hidden;")

with open("src/index.css", "w") as f:
    f.write(text)
