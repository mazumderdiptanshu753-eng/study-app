with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('import SplashScreen from "./components/SplashScreen";\\nimport SplashScreen from "./components/SplashScreen";', 'import SplashScreen from "./components/SplashScreen";')

with open("src/App.tsx", "w") as f:
    f.write(text)
