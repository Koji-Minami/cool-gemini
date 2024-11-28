from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    HarmBlockThreshold,
    HarmCategory,
    Image,
    Part,
    SafetySetting
)



import os,base64,json
from dotenv import load_dotenv

load_dotenv()
REGION = os.getenv('REGION')
PROJECT=os.getenv('GOOGLE_CLOUD_PROJECT')


import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting


def generate():
    '''
    
    '''
    vertexai.init(project="qwiklabs-asl-02-26483600cdad", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-pro-002",
    )
    responses = model.generate_content(
        [document1, audio1, text1],
        generation_config=generation_config,
        safety_settings=safety_settings,
    )

    return responses.text

with open('GazoMitsu.pdf','rb') as f:
    pdf_bytes = f.read()

document1 = Part.from_data(
    mime_type="application/pdf",
    data = pdf_bytes
)

with open('records.mp3','rb') as f:
    audio_bytes = f.read() 

audio1 = Part.from_data(
    mime_type='audio/mpeg',
    data= audio_bytes
)
    
text1 = """添付の音声データと画像データを使って下記2つのタスクを実行し、下記の形式に従って出力してください。
結果のみ出力し、それ以外は何も出力しないようにしてください。

# タスク1
この画像は車を買う時の見積もりです。音声データは、この見積もりの時の録音データです。見積もりに書かれている内容と、音声でお客様が希望した内容が一致しているかを、下記手順に従って確認してください。
1. 見積もりから車種、グレード、カラー、オプションをリストアップする。
2. 録音データから、リストアップした項目に対応する内容を抽出する。
3. Markdown形式の表でまとめる。一致欄には○,△,×で評価し、備考欄には明確に一致していない場合に理由を記入する
4. 作成したMarkdown形式の表を1行ごとにjsonl形式に変換した配列にしてください

# タスク2
この音声データは、自動車販売店の商談時の録音です。お客様と営業スタッフのどちらの発話かが分かるように、下記の形式で文字起こししてください。Timestampは発話が開始された時間を使ってください。salesとはcustomerに対して、車の紹介をしたり見積もりを作成したりする役割です。
## 形式[{id: 1, speaker: 'sales', content: 'こんにちは、今日はどのようなご用件ですか？', timestamp:'0:00:10'},{id: 2, speaker: 'customer', content: 'こんにちは、ヤリスという車を見に来ました', timestamp:'0:00:30'},

# タスク3
この音声データは、自動車販売店の商談時の録音です。300文字以下で要約してください。


# 出力形式
{"task1": タスク1の結果, "task2": タスク2の結果, "task3": タスク3の結果}"""

generation_config = {
    "max_output_tokens": 8192,
    "temperature": 1,
    "top_p": 0.95,
    "response_mime_type": "application/json"
}

safety_settings = [
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
]

response = generate()
print(response)

data = json.loads(response)

print(data)

print(data['task1'])