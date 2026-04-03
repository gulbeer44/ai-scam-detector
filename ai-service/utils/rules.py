from utils.link_utils import contains_link

def get_explanation(text):
    reasons = []
    t = text.lower()

    if any(w in t for w in ["bank", "account"]):
        reasons.append("Mentions sensitive financial/account information")

    if any(w in t for w in ["verify", "login"]):
        reasons.append("Requests sensitive action")

    if contains_link(text):
        reasons.append("Contains link")

    if any(w in t for w in ["urgent"]):
        reasons.append("Creates urgency")

    return reasons