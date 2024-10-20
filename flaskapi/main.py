from flask import Flask, jsonify,request
from flask_cors import CORS
from google.cloud import aiplatform
from vertexai.generative_models import (
    ChatSession,
    Content,
    FunctionDeclaration,
    GenerationConfig,
    GenerationResponse,
    GenerativeModel,
    Part,
    Tool,
)

from test import  generate
print(aiplatform.__version__)



app = Flask(__name__)

CORS(app)

@app.route("/")
def hello():
    data = {"text":"Hello Flask"}
    return jsonify(data)

@app.route("/upload",methods=["POST"])
def upload():
    audiofile = request.files['audio']
    pdffile = request.files['pdf']
    result = generate(audiofile,pdffile)
    print(result)
    return result

if __name__ == "__main__":
    app.run(debug=True)