
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)
CORS(app)  # Разрешить CORS для всех доменов

# Загрузка модели и токенизатора (DialoGPT-medium)
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    # Генерация ответа для DialoGPT
    input_ids = tokenizer.encode(user_message + tokenizer.eos_token, return_tensors="pt")
    reply_ids = model.generate(
        input_ids,
        max_length=128,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        top_p=0.95,
        temperature=0.7
    )
    bot_response = tokenizer.decode(reply_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5030, debug=True)
