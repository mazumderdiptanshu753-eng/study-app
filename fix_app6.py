import re

with open("src/App.tsx", "r") as f:
    text = f.read()

if 'import SplashScreen' not in text:
    text = text.replace('import WelcomePage from "./components/WelcomePage";', 'import WelcomePage from "./components/WelcomePage";\\nimport SplashScreen from "./components/SplashScreen";')

# Replace states and effect
text = re.sub(
    r"const \[hasStartedWelcome, setHasStartedWelcome\] = useState\<boolean\>\(false\);.*?const setCurrentTab = \(tab: \"dashboard\" \| \"notes\" \| \"chat\" \| \"videos\" \| \"admin\" \| \"gk\"\) => \{.*?setIsPageLoading\(true\);.*?setTimeout\(\(\) => \{.*?_setCurrentTab\(tab\);.*?setIsPageLoading\(false\);.*?\}, 5000\);.*?\};",
    """const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
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
  };""",
    text,
    flags=re.DOTALL
)

text = re.sub(
    r"\<AnimatePresence mode=\"wait\"\>\s*\{\(\!profile \&\& \!hasStartedWelcome\) \? \(",
    """<AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" theme={theme} lang={lang} />
      ) : (!profile && !hasStartedWelcome) ? (""",
    text,
    flags=re.DOTALL
)

with open("src/App.tsx", "w") as f:
    f.write(text)
