from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)
CORS(app)  # Разрешить CORS для всех доменов

# --- THIS IS THE PART THAT TAKES A LONG TIME ---
# When you run this script for the first time, these lines will:
# 1. Download the 'microsoft/DialoGPT-medium' model and tokenizer files
#    from the internet (Hugging Face model hub). This can be hundreds of MBs.
# 2. Save them to your local cache directory.
# 3. Load the model weights into your computer's memory.
# This process can take several minutes to an hour depending on your internet
# speed and system resources. Subsequent runs will be much faster as the
# model will be loaded from your local cache.
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
    # The Flask app will start listening on port 5030 once the model is loaded.
    # You should see output like "Running on http://0.0.0.0:5030/" once it's ready.
    app.run(host='0.0.0.0', port=5030, debug=True)
