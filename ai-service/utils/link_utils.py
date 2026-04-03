import re

def contains_link(text):
    pattern = r"(https?://[^\s]+|www\.[^\s]+)"
    return bool(re.search(pattern, text.lower()))

def extract_links(text):
    return re.findall(r"(https?://[^\s]+|www\.[^\s]+)", text.lower())