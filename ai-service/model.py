from ml.train import model, vectorizer
from ml.bert import bert_analyze
from utils.rules import get_explanation
from utils.link_utils import contains_link

def analyze_message(msg):
    msg_lower = msg.lower()

    vec = vectorizer.transform([msg])
    ml_prob = model.predict_proba(vec)[0][1]
    bert_prob = bert_analyze(msg)

    rule_score = 0

    if contains_link(msg):
        rule_score += 0.4

    final_score = (ml_prob * 0.3) + (bert_prob * 0.2) + (rule_score * 0.5)

    prediction = "Scam" if final_score > 0.45 else "Safe"

    return {
        "prediction": prediction,
        "confidence": round(final_score, 2),
        "scam_type": "General Scam" if prediction == "Scam" else "Safe",
        "risk_score": int(final_score * 100),
        "reasons": get_explanation(msg)
    }