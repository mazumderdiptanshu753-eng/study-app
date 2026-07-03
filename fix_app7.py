with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('import WelcomePage from "./components/WelcomePage";\\nimport SplashScreen from "./components/SplashScreen";', 'import WelcomePage from "./components/WelcomePage";\nimport SplashScreen from "./components/SplashScreen";')

with open("src/App.tsx", "w") as f:
    f.write(text)
