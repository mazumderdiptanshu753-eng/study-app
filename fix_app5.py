with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('import WelcomePage from "./components/WelcomePage";', 'import WelcomePage from "./components/WelcomePage";\\nimport SplashScreen from "./components/SplashScreen";')

block1 = '''  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
  const [currentTab, _setCurrentTab] = useState<"dashboard" | "notes" | "chat" | "videos" | "admin" | "gk">("dashboard");
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const setCurrentTab = (tab: "dashboard" | "notes" | "chat" | "videos" | "admin" | "gk") => {
    setIsPageLoading(true);
    setTimeout(() => {
      _setCurrentTab(tab);
      setIsPageLoading(false);
    }, 5000);
  };'''

new_block1 = """  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
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

text = text.replace(block1, new_block1)

block2 = '''    <AnimatePresence mode="wait">
      {(!profile && !hasStartedWelcome) ? ('''

new_block2 = """    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" theme={theme} lang={lang} />
      ) : (!profile && !hasStartedWelcome) ? ("""

text = text.replace(block2, new_block2)

with open("src/App.tsx", "w") as f:
    f.write(text)
