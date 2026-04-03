from ml.train import vectorizer, model
from ml.bert import bert_analyze
from utils.link_utils import contains_link
from utils.rules import get_explanation


def analyze_message(msg):
    msg_lower = msg.lower()

    import re
    clean_msg = re.sub(r"[^\w\s]", "", msg_lower)

    # ======================
    # ✅ FIX 1: REMOVE BAD SAFE GUARD → replaced with lighter version
    # ======================
    if len(msg.split()) < 5 and not contains_link(msg):
        return {
            "prediction": "Safe",
            "confidence": 0.01,
            "scam_type": "Safe",
            "risk_score": 1,
            "reasons": ["Very simple message"]
        }

    # ======================
    # ✅ FIX 2: STRONG SAFE OTP OVERRIDE
    # ======================
    if "otp" in msg_lower and "do not share" in msg_lower:
        return {
            "prediction": "Safe",
            "confidence": 0.1,
            "scam_type": "Safe",
            "risk_score": 10,
            "reasons": ["Legitimate OTP message"]
        }

    # ======================
    # 🔹 ML + BERT
    # ======================
    vec = vectorizer.transform([msg])
    ml_prob = model.predict_proba(vec)[0][1]
    bert_prob = bert_analyze(msg)

    # ======================
    # 🔥 STRONG RULE ENGINE
    # ======================
    rule_score = 0

    if any(w in msg_lower for w in ["lottery", "winner", "won", "prize", "reward", "congratulations", "lucky draw"]):
        rule_score += 0.9

    if "otp" in msg_lower:
        if any(w in msg_lower for w in ["share", "send", "forward"]):
            rule_score += 1.2

    if any(w in msg_lower for w in ["verify", "login", "update"]):
        rule_score += 0.6

    if any(w in msg_lower for w in ["bank", "account", "upi", "payment"]):
        rule_score += 0.6

    if any(w in msg_lower for w in ["urgent", "immediately"]):
        rule_score += 0.3

    # ======================
    # ✅ FIX 3: STRONGER LINK SCORE
    # ======================
    if contains_link(msg):
        rule_score += 1.0

    if any(w in msg_lower for w in ["free", "iphone", "offer", "gift"]):
        rule_score += 0.6

    if any(w in msg_lower for w in ["invest", "profit", "earn"]):
        if any(w in msg_lower for w in ["guaranteed", "double", "quick"]):
            rule_score += 1.0

    if any(w in msg_lower for w in ["job", "salary", "earn"]) and "fee" in msg_lower:
        rule_score += 0.9

    # ======================
    # ✅ FIX 4: CLAMP SCORE
    # ======================
    rule_score = min(rule_score, 1.5)

    # ======================
    # 🔥 FINAL SCORE
    # ======================
    final_score = (ml_prob * 0.25) + (bert_prob * 0.05) + (rule_score * 0.7)

    # ======================
    # 🔥 HARD OVERRIDES
    # ======================
    if "otp" in msg_lower and any(w in msg_lower for w in ["share", "send", "forward"]):
        prediction = "Scam"
        scam_type = "OTP Scam"

    elif any(w in msg_lower for w in ["winner", "won", "lucky draw", "congratulations", "lottery"]):
        prediction = "Scam"
        scam_type = "Lottery Scam"

    elif any(w in msg_lower for w in ["free", "iphone", "offer", "gift"]):
        prediction = "Scam"
        scam_type = "Phishing Scam"

    elif contains_link(msg) and any(w in msg_lower for w in ["verify", "login", "bank", "account"]):
        prediction = "Scam"
        scam_type = "Bank / Phishing Scam"

    elif rule_score >= 1.2:
        prediction = "Scam"
        scam_type = "High Risk Scam"

    elif final_score > 0.45:
        prediction = "Scam"
        scam_type = "General Scam"

    else:
        prediction = "Safe"
        scam_type = "Safe"

    # ======================
    # 🔍 EXPLANATION
    # ======================
    reasons = get_explanation(msg)

    return {
        "prediction": prediction,
        "confidence": round(final_score, 2),
        "scam_type": scam_type,
        "risk_score": int(final_score * 100),
        "reasons": reasons
    }