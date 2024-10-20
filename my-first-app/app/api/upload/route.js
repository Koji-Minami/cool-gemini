import { NextResponse } from "next/server";


export async function POST(req) {
    const formData = await req.formData();
    const audiofile = formData.get('audio');
    const pdffile = formData.get('pdf')
    const sendForm = new FormData();
    sendForm.append('audio',audiofile);
    sendForm.append('pdf',pdffile);
    const response = await fetch('http://127.0.0.1:5000/upload',{
        method: "POST",
        body: formData,
    });
    console.log('from API')
    const res = await response.json()
    console.log(res);
    return NextResponse.json(res)
}