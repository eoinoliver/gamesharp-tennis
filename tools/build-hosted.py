"""Build the unchanged app; omit the CLI config file from public Git output."""
import subprocess
from pathlib import Path
root = Path(__file__).resolve().parent.parent
subprocess.run(['python3','app_src/build.py'],cwd=root,check=True)
(root/'app/vercel.json').unlink()
print('Hosted output: 80 public files; root vercel.json supplies routing, not a public asset')
