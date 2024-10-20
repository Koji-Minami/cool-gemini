'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button"




export default function Home() {
  const [message, setMessage] = useState("Upload an MP3");
  const [audiofile, setAudioFile] = useState(null);
  const [pdffile, setPdfFile] = useState(null);

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handlePdfChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        setMessage(data.task1);
      } else {
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Select Audio File</label>
        <input type="file" name='mp3' accept=".mp3" onChange={handleAudioChange}/>
        <label>Select pdf File</label>
        <input type="file" name='pdf' accept=".pdf" onChange={handlePdfChange} />
        <Button type="submit">Upload</Button>
      </form>
      <p>{message}</p>
      <Button>Click me</Button>
    </div>
  );
}