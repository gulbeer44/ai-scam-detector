import pandas as pd
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

BASE_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(BASE_DIR)

sms_path = os.path.join(ROOT_DIR, "spam.csv")
email_path = os.path.join(ROOT_DIR, "email_spam", "enron_spam_data.csv")

df_sms = pd.read_csv(sms_path, encoding="latin-1")
df_sms = df_sms[['v1', 'v2']]
df_sms.columns = ['label', 'message']
df_sms['label'] = df_sms['label'].map({'ham': 0, 'spam': 1})

df_email = pd.read_csv(email_path)
df_email['message'] = df_email['Subject'].fillna('') + " " + df_email['Message'].fillna('')
df_email['label'] = df_email['Spam/Ham'].map({'ham': 0, 'spam': 1})
df_email = df_email[['label', 'message']]

df = pd.concat([df_sms, df_email], ignore_index=True)

vectorizer = TfidfVectorizer(stop_words='english', max_features=7000, ngram_range=(1, 2))
X_vec = vectorizer.fit_transform(df['message'])

model = LogisticRegression()
model.fit(X_vec, df['label'])