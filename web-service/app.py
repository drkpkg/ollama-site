import json
import os

import ollama
from ollama import Message
from dotenv import load_dotenv
from flask import Flask, render_template, request, Response

load_dotenv()

app = Flask(__name__)
client = ollama.Client(os.getenv("OLLAMA_SERVER"))


@app.route("/")
def root():
    return render_template("index.html")


@app.route("/v1-ask-question", methods=["POST"])
def question_v1():
    def streaming_response(input_data):
        for chunk in client.chat("llama2", messages=[input_data], stream=True):
            yield chunk['message']['content']
    text_question = Message(content=json.loads(request.data)['text'], role="user")
    return app.response_class(
        streaming_response(text_question),
        mimetype="application/json"
    )
