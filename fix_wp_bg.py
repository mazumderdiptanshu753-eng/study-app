with open("src/components/WelcomePage.tsx", "r") as f:
    text = f.read()

text = text.replace('bg-slate-950 text-white', '${theme.bgPage.split("/")[0]} ${theme.textMain}')
text = text.replace('style={{\n        background: "radial-gradient(circle at 50% 50%, #0b1528 0%, #030712 100%)"\n      }}', '')

with open("src/components/WelcomePage.tsx", "w") as f:
    f.write(text)
