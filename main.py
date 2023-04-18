from fastapi import FastAPI, File, UploadFile
from datetime import datetime
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload/")
async def upload_file(file: UploadFile = File(..., content_type='application/json')):
    content = await file.read()
    content_str = content.decode("utf-8")
    chat_data = json.loads(content_str)

    # Data-time distribution
    dates = [datetime.strptime(msg['date'], '%Y-%m-%dT%H:%M:%S') for msg in chat_data['messages']]

    # High-frequency words
    all_text = ' '.join([entity['text'] for msg in chat_data['messages'] for entity in msg['text_entities'] if
                         entity['type'] == 'plain'])
    tokens = word_tokenize(all_text)
    fdist = FreqDist(tokens)
    high_frequency_words = fdist.most_common(10)

    # Basic information
    chat_name = chat_data['name']
    msg_count = len(chat_data['messages'])
    days_have_chatted = len(set([msg['date'].split('T')[0] for msg in chat_data['messages']]))
    return {
        "chat_name": chat_name,
        "msg_count": msg_count,
        "days_have_chatted": days_have_chatted,
        "dates": dates,
        "high_frequency_words": high_frequency_words
    }
