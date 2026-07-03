with open("src/index.css", "r") as f:
    text = f.read()

text = text.replace('width: 100%;\n    height: 100%;\n    overflow: hidden;', '')
text = text.replace('#root {\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n  }', '')

with open("src/index.css", "w") as f:
    f.write(text)

with open("src/App.tsx", "r") as f:
    app = f.read()

# Change main container from fixed inset-0 flex flex-col to min-h-[100dvh] flex flex-col
app = app.replace('className={`fixed inset-0 flex flex-col ${theme.bgPage} ${theme.textMain} font-sans antialiased transition-colors duration-300`}', 'className={`min-h-[100dvh] flex flex-col ${theme.bgPage} ${theme.textMain} font-sans antialiased transition-colors duration-300`}')

# Change header from shrink-0 to sticky top-0
app = app.replace('header className={`shrink-0 z-50 w-full border-b ${theme.borderHeader} ${theme.bgHeader} transition-colors duration-300`}', 'header className={`sticky top-0 z-50 w-full border-b ${theme.borderHeader} ${theme.bgHeader} transition-colors duration-300`}')

# The main content no longer needs overflow-y-auto because body will scroll!
app = app.replace('main className="flex-1 min-h-0 w-full mx-auto max-w-7xl px-4 pt-6 pb-28 md:py-8 sm:px-6 relative overflow-y-auto overflow-x-hidden touch-scroll"', 'main className="flex-1 w-full mx-auto max-w-7xl px-4 pt-6 pb-28 md:py-8 sm:px-6 relative touch-scroll"')

with open("src/App.tsx", "w") as f:
    f.write(app)

