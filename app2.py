

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration

app = Flask(__name__)
CORS(app)  # Разрешить CORS для всех доменов

# Загрузка модели и токенизатора (BlenderBot 1B Distill)
tokenizer = BlenderbotTokenizer.from_pretrained("facebook/blenderbot-1B-distill")
model = BlenderbotForConditionalGeneration.from_pretrained("facebook/blenderbot-1B-distill")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    # Генерация ответа
    inputs = tokenizer([user_message], return_tensors="pt")
    reply_ids = model.generate(
        **inputs,
        max_length=1000,
        num_return_sequences=1,
        no_repeat_ngram_size=3,
        temperature=0.1,
        top_p=0.95
    )
    bot_response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)

    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5030, debug=True)
