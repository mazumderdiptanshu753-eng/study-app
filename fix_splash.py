with open("src/components/SplashScreen.tsx", "r") as f:
    text = f.read()

# Make the background solid for splash screen
text = text.replace('className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${theme.bgPage} ${theme.textMain}`}', 'className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${theme.bgPage.split("/")[0]} ${theme.textMain}`}')

with open("src/components/SplashScreen.tsx", "w") as f:
    f.write(text)
