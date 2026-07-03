with open("src/App.tsx", "r") as f:
    text = f.read()

# Add import
text = text.replace('import WelcomePage from "./components/WelcomePage";', 'import WelcomePage from "./components/WelcomePage";\nimport SplashScreen from "./components/SplashScreen";')

# Replace states and effect
old_state = '''  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
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

new_state = '''  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
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
    }, 300); // reduced from 5s
  };'''

text = text.replace(old_state, new_state)

with open("src/App.tsx", "w") as f:
    f.write(text)
