from transformers import pipeline

bert_model = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def bert_analyze(text):
    try:
        result = bert_model(text[:512])[0]
        return result['score'] if result['label'] == "NEGATIVE" else 1 - result['score']
    except:
        return 0