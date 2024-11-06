from flask import Flask, jsonify,request,Response
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

import time

from test import  (generate, generating,streaming)
print(aiplatform.__version__)



app = Flask(__name__)

CORS(app)

@app.route("/")
def hello():
    responses = generating()
    data = {"text":responses.text}
    return jsonify(data)

@app.route('/stream')
def stream():
    def stream_content():
        responses = streaming()
        for response in responses: # chunk_size=Noneでストリーミング受信
            for chunk in response.text:
                full_text += chunk
                message = {"text":chunk, "full_text":full_text}
                yield f"data: {json.dumps(message)}\n\n"  # SSEのフォーマット
                # time.sleep(0.1) # 必要に応じて遅延を追加

    return Response(stream_content(), mimetype="text/event-stream")

@app.route("/upload",methods=["POST"])
def upload():
    audiofile = request.files['audio']
    pdffile = request.files['pdf']
    result = generate(audiofile,pdffile)
    print(result)
    return result

if __name__ == "__main__":
    app.run(debug=True)