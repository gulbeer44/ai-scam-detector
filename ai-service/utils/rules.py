from utils.link_utils import contains_link

def get_explanation(text):
    reasons = []
    t = text.lower()

    if any(w in t for w in ["bank", "account", "upi", "payment"]):
        reasons.append("Mentions sensitive financial/account information")

    if any(w in t for w in ["verify", "login", "update"]):
        reasons.append("Requests sensitive action")

    if contains_link(text):
        reasons.append("Contains link")

    if any(w in t for w in ["urgent", "immediately"]):
        reasons.append("Creates urgency")

    if "otp" in t:
        if "do not share" in t:
            reasons.append("Advises not to share OTP (safe)")
        elif any(w in t for w in ["share", "send", "forward"]):
            reasons.append("Requests OTP sharing (unsafe)")

    if any(w in t for w in ["winner", "won", "lottery", "congratulations"]):
        reasons.append("Possible lottery scam")

    return reasons