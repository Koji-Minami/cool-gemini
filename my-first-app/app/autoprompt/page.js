'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileAudio, FileText, Menu, MessageSquare, X, Send, FileUp  } from "lucide-react"


export default function Auto() {
  const [message, setMessage] = useState("Upload an MP3");
  const [audiofile, setAudioFile] = useState(null);
  const [pdffile, setPdfFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [prompt,setPrompt] = useState([])
  const [engineerRes, setEngineerRes] = useState([])
  const [managerRes, setManagerRes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfURL, setPdfUrl] = useState(null);
  const [revise, setRevise] = useState(false);
  const [judge, setjudge] = useState('');
 


  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handlePdfChange = (event) => {
    setPdfFile(event.target.files[0]);
    setPdfUrl(URL.createObjectURL(event.target.files[0]));
  };

  const makeIndex = (jsonArray) => {
      let maxLength = 0;
      let longestIndices = [];
    
      for (let i = 0; i < jsonArray.length; i++) {
        const jsonLength = JSON.stringify(jsonArray[i]).length; // 文字列化したJSONの長さを取得
    
        if (jsonLength > maxLength) {
          maxLength = jsonLength;
          longestIndices = [i]; // 新しい最長が見つかったら、インデックス配列をリセット
        } else if (jsonLength === maxLength) {
          longestIndices.push(i); // 同じ長さのものがあれば、インデックスを追加
        }
      }
      return longestIndices;
    }
  

  const handleSubmit = async (event) => {
    console.log('push')
    event.preventDefault();
    setIsLoading(true);

    if (!audiofile) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audiofile);
    formData.append("pdf",pdffile)
    let count = 0;
    while(!revise){
    try {
        const response = await fetch("https://mybackend-732318641740.us-central1.run.app/engineer", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            setPrompt(prev => [...prev.map(item => item),data.prompt]);
            setEngineerRes(prev => [...prev.map(item => item),data.engineer]);
            const manares = await fetch("https://mybackend-732318641740.us-central1.run.app/manager", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
             });
            if (manares.ok) {
                const manadata = await manares.json();
                console.log(manadata);
                console.log(manadata.advice);
                console.log(manadata.judge);
                setManagerRes(prev => [...prev.map(item => item),manadata.advice]);
                setRevise(manadata.judge);
                if(revise){
                  setjudge('True');
                }
                count += 1;
            } else {
                setMessage("Upload failed.");
            }}
          } catch (error) {
          console.error("Error:", error);
          setMessage("An error occurred.");
          }
        if (count >= 5){
          count = 0;
          break
      }
    }
        setIsLoading(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'sales',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white w-64 min-h-screen p-4 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <form>
        <Card className="mb-4">
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileAudio className="w-5 h-5" />
              Upload Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
              <div className="space-y-1">
                <Label htmlFor="audio-file" className="text-sm">Select Audio File</Label>
                <Input id="audio-file" type="file" accept="audio/*" className="text-sm" onChange={handleAudioChange} />
              </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Upload PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
              <div className="space-y-1">
                <Label htmlFor="pdf-file" className="text-sm">Select PDF File</Label>
                <Input id="pdf-file" type="file" accept=".pdf" className="text-sm" onChange={handlePdfChange}/>
              </div> 
          </CardContent>
        </Card>
        <Button type="submit" className="w-full text-sm mt-4" onClick={handleSubmit}>Upload</Button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto h-[100vt]">
      <div className="bg-white h-1/3 rounded shadow mb-2">
        <h1 className="text-2xl font-bold mb-4 ml-2">Prompt</h1>
        {prompt.map((content,index)=> (
                <div key={index}>{content}</div>
        ))}
      </div>
      <div className="bg-white h-1/3 rounded shadow mb-2">
        <h1 className="text-2xl font-bold mb-4 ml-2">Engineer Response</h1>
       {engineerRes.map((content,index)=> (
                <div key={index}>{content}</div>
        ))}
      </div>
      <div className="bg-white h-1/3 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 ml-2">Manager Judge</h1>
        <p className='mb-8'>{judge}</p>
        <h1 className="text-2xl font-bold mb-4 ml-2">Manager Advice</h1>
        {managerRes.map((content,index)=> (
                <div key={index}>{content}</div>
        ))}
      </div>
      </main>
    </div>
  )
}