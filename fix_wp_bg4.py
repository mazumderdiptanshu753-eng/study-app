with open("src/components/WelcomePage.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'className="min-h-[100dvh]' in line:
        # replace the starting " with {` and ending " with `}
        new_line = line.replace('className="', 'className={`')
        new_line = new_line.rstrip()
        if new_line.endswith('"'):
            new_line = new_line[:-1] + '`}\n'
        else:
            new_line = new_line + '\n'
        lines[i] = new_line

with open("src/components/WelcomePage.tsx", "w") as f:
    f.writelines(lines)
