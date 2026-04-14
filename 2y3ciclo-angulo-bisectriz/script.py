import re

with open('angulos-bisectriz_II y III-Ciclo_Básica.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find main-content
main_match = re.search(r'(<main class="main" id="main-content">)(.*?)(</main>)', html, re.DOTALL)
main_start, main_inner, main_end = main_match.groups()

# Find all cards
cards = re.findall(r'<div class="card.*?</div>\n    </div>|<!-- META[^<]*-->(?:.*?)<div class="card.*?</div>|<div class="card.*?^\s*</div>', main_inner, re.DOTALL | re.MULTILINE)

print(f"Encontradas {len(cards)} cards o bloques.")
