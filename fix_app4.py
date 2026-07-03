with open("src/App.tsx", "r") as f:
    text = f.read()

import re

# Add import if not present
if 'import SplashScreen' not in text:
    text = text.replace('import WelcomePage from "./components/WelcomePage";', 'import WelcomePage from "./components/WelcomePage";\\nimport SplashScreen from "./components/SplashScreen";')

# We'll use regex to replace the state block and useEffect
pattern = r"  const \[hasStartedWelcome, setHasStartedWelcome\] = useState\<boolean\>\(false\);\n  const \[currentTab, _setCurrentTab\] = useState\<\"dashboard\" \| \"notes\" \| \"chat\" \| \"videos\" \| \"admin\" \| \"gk\"\>\(\"dashboard\"\);\n  const \[isPageLoading, setIsPageLoading\] = useState\(true\);\n\n  useEffect\(\(\) => \{\n    const timer = setTimeout\(\(\) => \{\n      setIsPageLoading\(false\);\n    \}, 5000\);\n    return \(\) => clearTimeout\(timer\);\n  \}, \[\]\);\n\n  const setCurrentTab = \(tab: \"dashboard\" \| \"notes\" \| \"chat\" \| \"videos\" \| \"admin\" \| \"gk\"\) => \{\n    setIsPageLoading\(true\);\n    setTimeout\(\(\) => \{\n      _setCurrentTab\(tab\);\n      setIsPageLoading\(false\);\n    \}, 5000\);\n  \};"

new_state = """  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
  const [currentTab, _setCurrentTab] = useState<"dashboard" | "notes" | "chat" | "videos" | "admin" | "gk">("dashboard");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(splashTimer);
  }, []);

  const setCurrentTab = (tab: "dashboard" | "notes" | "chat" | "videos" | "admin" | "gk") => {
    setIsPageLoading(true);
    setTimeout(() => {
      _setCurrentTab(tab);
      setIsPageLoading(false);
    }, 300);
  };"""

text = re.sub(pattern, new_state, text)

# Insert the splash screen check right after `<AnimatePresence mode="wait">`
render_pattern = r"<AnimatePresence mode=\"wait\">\s*\{\(\!profile \&\& \!hasStartedWelcome\) \? \("
new_render = """<AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" theme={theme} lang={lang} />
      ) : (!profile && !hasStartedWelcome) ? ("""

text = re.sub(render_pattern, new_render, text)

with open("src/App.tsx", "w") as f:
    f.write(text)
