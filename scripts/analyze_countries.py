import re
import json
import os

def parse_dart_countries(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find Country(...)
    # Country(name: "afghanistan", code: "+93", flag: "🇦🇫", min: 9, max: 9),
    pattern = r'Country\s*\(\s*name:\s*"([^"]+)",\s*code:\s*"([^"]+)",\s*flag:\s*"([^"]+)",\s*min:\s*(\d+),\s*max:\s*(\d+)\s*\)'
    matches = re.findall(pattern, content)
    countries = []
    for m in matches:
        countries.append({
            "name": m[0],
            "code": m[1],
            "flag": m[2],
            "min": int(m[3]),
            "max": int(m[4])
        })
    return countries

def parse_ts_countries(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find simple JSON-like objects in the array
    # {"name": "afghanistan", "code": "+93", "min": 9, "max": 9},
    # Note: parsing TS/JS with regex is brittle, but sufficient for this specific file format
    pattern = r'\{\s*"name":\s*"([^"]+)",\s*"code":\s*"([^"]+)",\s*"min":\s*(\d+),\s*"max":\s*(\d+)(?:,\s*"flag":\s*"([^"]+)")?\s*\}'
    matches = re.findall(pattern, content)
    countries = []
    for m in matches:
        c = {
            "name": m[0],
            "code": m[1],
            "min": int(m[2]),
            "max": int(m[3])
        }
        if m[4]:
            c["flag"] = m[4]
        countries.append(c)
    return countries

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    dart_path = 'mobile-app/lib/data/countries.dart'
    ts_path = 'web-platform/src/lib/countries.ts'
    mobile_i18n_path = 'mobile-app/lib/i18n/strings.i18n.json'
    web_i18n_path = 'web-platform/messages/en.json'

    dart_countries = parse_dart_countries(dart_path)
    ts_countries = parse_ts_countries(ts_path)
    
    print(f"Dart countries found: {len(dart_countries)}")
    print(f"TS countries found: {len(ts_countries)}")

    mobile_i18n = load_json(mobile_i18n_path)
    web_i18n = load_json(web_i18n_path)

    mobile_country_names = mobile_i18n.get('countries', {})
    web_country_names = web_i18n.get('countries', {})

    # Check for missing keys in translations
    missing_mobile = []
    missing_web = []
    
    for c in dart_countries:
        if c['name'] not in mobile_country_names:
            missing_mobile.append(c['name'])
        if c['name'] not in web_country_names:
            missing_web.append(c['name'])

    print(f"Missing in mobile i18n: {missing_mobile}")
    print(f"Missing in web i18n: {missing_web}")

    # Generate new TS content with flags
    new_ts_content = 'export interface Country {\n  name: string;\n  code: string;\n  min: number;\n  max: number;\n  flag: string;\n}\n\nexport const countries: Country[] = [\n'
    for c in dart_countries:
        new_ts_content += f'  {{ name: "{c["name"]}", code: "{c["code"]}", min: {c["min"]}, max: {c["max"]}, flag: "{c["flag"]}" }},\n'
    new_ts_content += '];\n'

    with open('new_countries.ts', 'w', encoding='utf-8') as f:
        f.write(new_ts_content)
    
    print("Generated new_countries.ts")

if __name__ == "__main__":
    main()
