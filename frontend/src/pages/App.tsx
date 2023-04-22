import React, { useState, useEffect } from "react";
import { Card, Tab, TabList, Text, Title } from "@tremor/react";
import ChatTrend from "@/pages/component/ChatTrend";
import UploadForm from "@/pages/component/UploadForm";
import BasicInformation from "@/pages/component/BasicInformation";
import HighFreqWords from "@/pages/component/HighFreqWords";
import Search from "@/pages/component/Search";
import SenderCounts from "@/pages/component/SenderCounts";
import SpecialTime from "@/pages/component/SpecialTime";
import { useRouter } from "next/router";

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

interface AnalysisData {
  chat_name: string;
  msg_count: number | null;
  days_have_chatted: number | null;
  dates: any;
  high_frequency_words: [string, number][];
  sender_counts: { [sender: string]: number };
  earliest: string;
  latest: string;
}

export default function KpiCardGrid() {
  const [selectedView, setSelectedView] = useState("1");
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    chat_name: "",
    msg_count: 0,
    days_have_chatted: 0,
    dates: [],
    high_frequency_words: [],
    sender_counts: {},
    earliest: "",
    latest: "",
  });
  const [uploadedFileContent, setUploadedFileContent] = useState(null);
  const router = useRouter();
  const initialSearchTerm = router.query.q || "";
  useEffect(() => {
    if (initialSearchTerm) {
      setSelectedView("2");
    }
  }, [initialSearchTerm]);

  const handleAnalysisDataReceived = (data: any) => {
    setAnalysisData(data);
  };

  const handleUploadedFileContent = (content: any) => {
    setUploadedFileContent(content);
  };

  const handleHasRemoved = (hasRemoved: boolean) => {
    if (hasRemoved) {
      setAnalysisData({
        chat_name: "",
        msg_count: 0,
        days_have_chatted: 0,
        dates: [],
        high_frequency_words: [],
        sender_counts: {},
        earliest: "",
        latest: "",
      });
    }
  };

  // @ts-ignore
  return (
    <div className="bg-slate-50 p-6 sm:p-10 h-screen md:text-2xl">
      <div className="mb-4">
        <Title>Telegram 小助手</Title>
        <Text>
          <label>上传聊天记录文件以开始</label>
        </Text>
      </div>
      <UploadForm
        onAnalysisDataReceived={handleAnalysisDataReceived}
        onUploadedFileContentReceived={handleUploadedFileContent}
        onHasRemoved={handleHasRemoved}
      />
      {analysisData.chat_name && (
        <div>
          <TabList
            defaultValue="1"
            onValueChange={(value) => setSelectedView(value)}
            className="mt-6"
          >
            <Tab value="1" text="总览" />
            <Tab value="2" text="搜索" />
          </TabList>
          <br />
          {selectedView === "1" ? (
            <>
              <BasicInformation
                chatName={analysisData.chat_name}
                //@ts-ignore
                msgCount={
                  analysisData.msg_count ? analysisData.msg_count : null
                }
                //@ts-ignore
                days_have_chatted={
                  analysisData.days_have_chatted
                    ? analysisData.days_have_chatted
                    : null
                }
              />
              <div className="mb-6">
                <ChatTrend dates={analysisData.dates} />
              </div>
              <div className="flex flex-row gap-4-myself">
                <HighFreqWords data={analysisData.high_frequency_words} />
                <SenderCounts data={analysisData.sender_counts} />
                <SpecialTime
                  earliest={analysisData.earliest}
                  latest={analysisData.latest}
                />
              </div>
            </>
          ) : (
            <Card className="mt-6">
              <div className="h-96">
                <Search uploadedFileContent={uploadedFileContent} />
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
