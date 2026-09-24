import json, glob, shutil, datetime, sys

INDEX = "index.html"

# 1. backup
ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
bak = f"index.html.bak_{ts}"
shutil.copy(INDEX, bak)
print("backup:", bak)

text = open(INDEX, encoding="utf-8").read()

# 2. locate QBANK array via bracket-walk
marker = "const QBANK = "
mi = text.index(marker)
start = text.index("[", mi)          # opening bracket of array
i = start
depth = 0
in_str = False
esc = False
end = None
while i < len(text):
    c = text[i]
    if in_str:
        if esc: esc = False
        elif c == "\\": esc = True
        elif c == '"': in_str = False
    else:
        if c == '"': in_str = True
        elif c == "[": depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                end = i
                break
    i += 1
assert end is not None, "could not find QBANK array end"

arr_text = text[start:end+1]
existing = json.loads(arr_text)
print("existing QBANK length:", len(existing))

# 3. gather new questions in player order
order = ["MURRAY","WAWRINKA","DELPOTRO","SINNER","GRAF","SERENA","VENUS","ASHE","COURT",
         "RODDICK","PEGULA","SHELTON","RUUD","GAUFF","SVITOLINA","MONFILS","HINGIS","SELES","KYRGIOS"]
new = []
for p in order:
    fn = f"QBANK_BATCH_{p}_v1.json"
    new += json.load(open(fn, encoding="utf-8"))
print("new questions:", len(new))

# 4. collision check
ex_ids = {q["id"] for q in existing}
new_ids = [q["id"] for q in new]
assert len(new_ids) == len(set(new_ids)), "duplicate ids within new"
clash = ex_ids & set(new_ids)
assert not clash, f"ID collision with existing: {clash}"

# 5. build combined array text (compact, same style as existing)
combined = existing + new
new_arr_text = json.dumps(combined, separators=(",", ":"), ensure_ascii=False)

new_text = text[:start] + new_arr_text + text[end+1:]

# 6. verify the new array re-parses
mi2 = new_text.index(marker); start2 = new_text.index("[", mi2)
i, depth, in_str, esc, end2 = start2, 0, False, False, None
while i < len(new_text):
    c = new_text[i]
    if in_str:
        if esc: esc=False
        elif c=="\\": esc=True
        elif c=='"': in_str=False
    else:
        if c=='"': in_str=True
        elif c=="[": depth+=1
        elif c=="]":
            depth-=1
            if depth==0: end2=i; break
    i+=1
check = json.loads(new_text[start2:end2+1])
assert len(check) == len(existing) + len(new), "length mismatch after insert"

if "--write" in sys.argv:
    open(INDEX, "w", encoding="utf-8").write(new_text)
    print(f"WROTE index.html — QBANK now {len(check)} questions")
else:
    print(f"DRY RUN ok — would grow QBANK {len(existing)} -> {len(check)}")
