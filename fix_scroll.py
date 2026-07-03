with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('<main className="flex-1 w-full mx-auto max-w-7xl px-4 pt-6 pb-28 md:py-8 sm:px-6 relative overflow-y-auto touch-scroll">', '<main className="flex-1 min-h-0 w-full mx-auto max-w-7xl px-4 pt-6 pb-28 md:py-8 sm:px-6 relative overflow-y-auto overflow-x-hidden touch-scroll">')

with open("src/App.tsx", "w") as f:
    f.write(text)
