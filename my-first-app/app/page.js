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


export default function Component() {
  const [message, setMessage] = useState("Upload an MP3");
  const [audiofile, setAudioFile] = useState(null);
  const [audiofilename, setAudioFileName] = useState('temp.mp3')
  const [pdffile, setPdfFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [tablebody,setTableBody] = useState([])
  const [tableindex, setTableIndex] = useState([])
  const [pdfURL, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');


  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
    setAudioFileName(event.target.files[0].name);
    console.log(audiofilename);
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
    event.preventDefault();
    setMessages([])
    setTableIndex([])
    setTableBody([])
    setIsLoading(true);

    if (!audiofile) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audiofile);
    formData.append("pdf",pdffile)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const key = Object.keys(data.task1[makeIndex(data.task1)])
        key.reverse();
        setTableIndex(key);
        setTableBody(data.task1);
        setMessages(data.task2)
        setSummary(data.task3);
      } else {
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
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
      <main className="flex-1 p-4 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Main Content</h2>
          <div className="flex gap-2">
            <Button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <Button onClick={() => setTranscriptOpen(true)}>
              <MessageSquare className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col space-y-4 basis-2/3 mr-3 h-[calc(100vh-6rem)]">
            <div className="h-5/6">
            <Card className='mb-4 flex-grow overflow-y-auto h-full'>
              <CardHeader>
                <CardTitle>Data Table</CardTitle>
              </CardHeader>
              <CardContent >
                <Table >
                  <TableHeader>
                    <TableRow>
                      {tableindex.map((content,index) => (
                        <TableHead key={index}>{content}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tablebody.map((content,rowindex) => (
                      <TableRow key={rowindex}>
                        {tableindex.map((columnIndex,rowindex2) => (
                              <TableCell key={rowindex2} className='max-w-48'>{content[tableindex[rowindex2]]}</TableCell>
                        ))}
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            </div>
            <div className='h-1/6'>
            <Card className='h-full' >
              <CardHeader>
                <CardTitle>Sales Talk Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder={summary}
                  className="min-w-48"
                />
              </CardContent>
            </Card>
            </div>
        </div>
        <div className="basis-1/3 ">
        <Card className='h-[calc(100vh-6rem)]'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                PDF Viewer
              </CardTitle>
            </CardHeader>
            {pdfURL ? (               
            <CardContent className=" flex flex-col items-center justify-center bg-gray-100 text-gray-500 h-[calc(100vh-12rem)]">
              <iframe className="w-full h-full" src={pdfURL} title="PDF Viewer"/>
            </CardContent>    
            ):(     
           <CardContent className="flex flex-col items-center justify-center bg-gray-100 text-gray-500 h-[calc(100vh-12rem)]">
              <FileUp className="w-12  mb-4" />
              <p className="text-center">No PDF uploaded yet. Upload a PDF file to view its contents here.</p>
            </CardContent>

            )}
          </Card>
          </div>
          </div>
      </main>

      {/* Chat-like Transcript Slide-over */}
      <div className={` fixed inset-y-0 right-0 w-[550px] bg-white shadow-lg transform ${transcriptOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Conversation Transcript</h3>
            <Button variant="ghost" size="icon" onClick={() => setTranscriptOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-grow p-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.speaker === 'sales' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex ${message.speaker === 'sales' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                <Avatar className={`w-8 h-8 ${message.speaker === 'sales' ? 'ml-2' : 'mr-2'}`}>
                  <AvatarFallback className={message.speaker === 'sales' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}>
                    {message.speaker === 'sales' ? 'S' : 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className={`p-2 rounded-lg ${message.speaker === 'sales' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}