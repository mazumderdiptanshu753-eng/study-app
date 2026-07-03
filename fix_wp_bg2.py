with open("src/components/WelcomePage.tsx", "r") as f:
    text = f.read()

text = text.replace('className="min-h-[100dvh] w-full relative ${theme.bgPage.split(\\"/\\")[0]} ${theme.textMain} flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 md:px-8 py-12"', 'className={`min-h-[100dvh] w-full relative ${theme.bgPage.split("/")[0]} ${theme.textMain} flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 md:px-8 py-12`}')

with open("src/components/WelcomePage.tsx", "w") as f:
    f.write(text)
