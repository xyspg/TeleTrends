from fastapi import FastAPI, File, UploadFile
from datetime import datetime, time, timedelta
import nltk

nltk.download('punkt')         
nltk.download('stopwords')   
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
from nltk.corpus import stopwords
import string
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import pytz
from bs4 import BeautifulSoup
import re
import json


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_date(date_str: str) -> str:
    time = datetime.strptime(date_str, "%d.%m.%Y %H:%M:%S UTC%z")
    utc_time = time - time.utcoffset()
    formatted_time = utc_time.strftime("%Y-%m-%dT%H:%M:%S")
    return formatted_time


def html_to_json(html: str) -> dict:
    soup = BeautifulSoup(html, 'html.parser')

    name = soup.find('div', {'class': 'text bold'}).text.strip()
    messages = []

    for message in soup.find_all('div', {'class': 'message default clearfix'}):
        msg = {}
        msg['id'] = int(re.findall(r'\d+', message['id'])[0])
        msg['date'] = message.find('div', {'class': 'pull_right date details'})['title']
        msg['from'] = message.find('div', {'class': 'from_name'}).text.strip()
        text_div = message.find('div', {'class': 'text'})

        if text_div:
            msg['text'] = text_div.text.strip()
            text_entities = []

            for entity in text_div.find_all('a', href=True):
                text_entities.append({
                    'type': 'custom_emoji',
                    'text': entity.text.strip(),
                    'document_id': entity['href']
                })

            msg['text_entities'] = text_entities
        else:
            msg['text'] = ''
            msg['text_entities'] = []

        messages.append(msg)

    json_structure = {
        'name': name,
        'type': 'personal_chat',
        'messages': messages
    }

    return json_structure


@app.post("/upload/")
async def upload_file(file: UploadFile = File(..., content_type='application/json')):
    content = await file.read()
    content_str = content.decode("utf-8")
    if file.content_type == 'text/html':
        chat_data = html_to_json(content_str)

        for message in chat_data['messages']:
            message['date'] = parse_date(message['date'])

    else:
        all_data = json.loads(content_str)
    # TODO: Implement support for HTML

    all_chats_results = {}
    for chat_data in all_data["chats"]["list"]:
        dates = [datetime.strptime(msg['date'], '%Y-%m-%dT%H:%M:%S') for msg in chat_data['messages']]
        # High-frequency words
        all_text = ' '.join([entity['text'].replace('“', '"').replace('”', '"') for msg in chat_data['messages'] for entity in msg['text_entities'] if entity['type'] == 'plain'])
        tokens = word_tokenize(all_text)
        stop_words = set(stopwords.words("english"))
        punctuations = set(string.punctuation)
        filtered_tokens = [token.lower() for token in tokens if
                           token.lower() not in stop_words and token not in punctuations]
        fdist = FreqDist(filtered_tokens)
        high_frequency_words = fdist.most_common(100)

        # Basic information
        chat_name = chat_data.get('name', 'Saved Messages')
        if chat_name == "null" or chat_name is None:
            chat_name = "Deleted Account"

        msg_count = len(chat_data['messages'])
        days_have_chatted = len(set([msg['date'].split('T')[0] for msg in chat_data['messages']]))

        # sender statistics
        sender_counts = defaultdict(int)
        for msg in chat_data['messages']:
            if 'from' in msg:
                sender = msg['from']
                sender_counts[sender] += 1

        # Special Statistics
        message_times = [datetime.strptime(msg['date'], '%Y-%m-%dT%H:%M:%S').time() for msg in chat_data['messages']]

        # Define time constraints
        late_night_start = time(0, 0)
        late_night_end = time(5, 0)
        early_morning_start = time(5, 0)
        early_morning_end = time(9, 0)

        # Filter chat times within the constraints
        late_night_times = [t for t in message_times if late_night_start <= t < late_night_end]
        early_morning_times = [t for t in message_times if early_morning_start <= t < early_morning_end]

        # Find the earliest and latest chat times
        latest_time = max(late_night_times, default=None)
        earliest_time = min(early_morning_times, default=None)

        all_chats_results[chat_name] = {
                   "chat_name" : chat_name,
                   "msg_count": msg_count,
                   "days_have_chatted": days_have_chatted,
                   "earliest": earliest_time.strftime("%H:%M:%S") if earliest_time else None,
                   "latest": latest_time.strftime("%H:%M:%S") if latest_time else None,
                   "sender_counts": dict(sender_counts),
                   "high_frequency_words": high_frequency_words,
                   "dates": dates,
               }
    return {"chat_names": list(all_chats_results.keys()),"all_chats_results": all_chats_results}
