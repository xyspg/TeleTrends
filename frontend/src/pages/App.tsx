import React, { useState } from "react";
import { Card, Tab, TabList, Text, Title } from "@tremor/react";
import ChatTrend from "@/pages/component/ChatTrend";
import UploadForm from "@/pages/component/UploadForm";
import BasicInformation from "@/pages/component/BasicInformation";
import HighFreqWords from "@/pages/component/HighFreqWords";

async function uploadFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error uploading file");
  }
}

export default function KpiCardGrid() {
  const [selectedView, setSelectedView] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [analysisData, setAnalysisData] = useState({
    chat_name: "",
    msg_count: "",
    days_have_chatted: "",
    dates: [],
    high_frequency_words: [],
  });

  const handleAnalysisDataReceived = (data) => {
    setAnalysisData(data);
  };

  async function handleUpload() {
    if (file) {
      setUploading(true);
      try {
        const data = await uploadFile(file);
        setUploadResult(data);
      } catch (error) {
        // @ts-ignore
        console.error(error.message);
      } finally {
        setUploading(false);
      }
    }
  }

  return (
    <div className="bg-slate-50 p-6 sm:p-10">
      <div className="mb-4">
        <Title>Telegram Chat History Analyzer</Title>
        <Text>
          <label>Upload your file to begin.</label>
        </Text>
      </div>
      <UploadForm onAnalysisDataReceived={handleAnalysisDataReceived} />
      <TabList
        defaultValue="1"
        onValueChange={(value) => setSelectedView(value)}
        className="mt-6"
      >
        <Tab value="1" text="Overview" />
        <Tab value="2" text="Detail" />
      </TabList>
      <br />

      {selectedView === "1" ? (
        <>
          <BasicInformation
            chatName={analysisData.chat_name}
            msgCount={analysisData.msg_count}
            days_have_chatted={analysisData.days_have_chatted}
          />
          <div className="mb-6">
            <ChatTrend dates={analysisData.dates} />
          </div>
          <div>
            <HighFreqWords data={analysisData.high_frequency_words} />
          </div>
        </>
      ) : (
        <Card className="mt-6">
          <div className="h-96" />
        </Card>
      )}
    </div>
  );
}
