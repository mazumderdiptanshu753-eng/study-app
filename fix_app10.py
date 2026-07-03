import re

with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('<WelcomePage \n            onStart={() => setHasStartedWelcome(true)}\n            lang={lang}\n            onLanguageChange={handleLanguageChange}\n          />', '<WelcomePage \n            onStart={() => setHasStartedWelcome(true)}\n            lang={lang}\n            onLanguageChange={handleLanguageChange}\n            theme={theme}\n          />')
text = text.replace('<WelcomePage ', '<WelcomePage theme={theme} ')

with open("src/App.tsx", "w") as f:
    f.write(text)

with open("src/components/WelcomePage.tsx", "r") as f:
    wp = f.read()

wp = wp.replace('import { Language, TRANSLATIONS } from "../lib/translations";', 'import { Language, TRANSLATIONS } from "../lib/translations";\nimport { ThemeConfig } from "../lib/themes";')
wp = wp.replace('interface WelcomePageProps {\n  onStart: () => void;\n  lang: Language;\n  onLanguageChange: (lang: Language) => void;\n}', 'interface WelcomePageProps {\n  onStart: () => void;\n  lang: Language;\n  onLanguageChange: (lang: Language) => void;\n  theme: ThemeConfig;\n}')
wp = wp.replace('export default function WelcomePage({ onStart, lang, onLanguageChange }: WelcomePageProps) {', 'export default function WelcomePage({ onStart, lang, onLanguageChange, theme }: WelcomePageProps) {')
wp = wp.replace('bg-[#0b0f19]', '${theme.bgPage.split("/")[0]}')

with open("src/components/WelcomePage.tsx", "w") as f:
    f.write(wp)
