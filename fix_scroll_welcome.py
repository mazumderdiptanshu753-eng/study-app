with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('className="h-[100dvh] w-full flex flex-col"', 'className="min-h-[100dvh] w-full flex flex-col"')

with open("src/App.tsx", "w") as f:
    f.write(text)

with open("src/components/WelcomePage.tsx", "r") as f:
    wp = f.read()

wp = wp.replace('className={`flex-1 h-full w-full relative ${theme.bgPage.split("/")[0]} ${theme.textMain} flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 md:px-8 py-12`}', 'className={`flex-1 min-h-[100dvh] w-full relative ${theme.bgPage.split("/")[0]} ${theme.textMain} flex flex-col items-center justify-center overflow-x-hidden px-4 md:px-8 py-12 touch-scroll`}')

with open("src/components/WelcomePage.tsx", "w") as f:
    f.write(wp)
