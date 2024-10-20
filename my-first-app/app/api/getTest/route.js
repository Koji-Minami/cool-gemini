import { NextResponse } from "next/server";


export async function GET() {
    const response = await fetch('http://127.0.0.1:5000');
    console.log('from API')
    const res = await response.json()
    console.log(res);
    return NextResponse.json(res)
}