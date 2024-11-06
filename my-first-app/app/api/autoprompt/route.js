import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData();
    const audiofile = formData.get('audio');
    const pdffile = formData.get('pdf')
    const sendForm = new FormData();
    sendForm.append('audio',audiofile);
    sendForm.append('pdf',pdffile);
    console.log('apiきた')
    const res = {
        "gemini": "geminiのアンサーが出るはず",
        "prompt":"プロンプトが出力されるはず",
        "engineer":"修正版のプロンプトが出るはず",
        "manager":"マネージャーの見解が出るはず",
        "judge":"False"}
    console.log('from API')
    console.log(res);
    return NextResponse.json(res)
}