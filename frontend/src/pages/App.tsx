//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Card, Tab, TabList, Text, Title } from "@tremor/react";
import ChatTrend from "@/pages/component/ChatTrend";
import UploadForm from "@/pages/component/UploadForm";
import BasicInformation from "@/pages/component/BasicInformation";
import HighFreqWords from "@/pages/component/HighFreqWords";
import Search from "@/pages/component/Search";
import SenderCounts from "@/pages/component/SenderCounts";
import SpecialTime from "@/pages/component/SpecialTime";
import Guide from "@/pages/component/Guide";
import { Dropdown, DropdownItem } from "@tremor/react";
import { useRouter } from "next/router";
import { Button, message, Space } from 'antd';
import {handle} from "mdast-util-to-markdown/lib/handle";

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

export default function App() {
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
  const [chatNames, setChatNames] = useState<string[]>([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(null);
  const [selectedChatData, setSelectedChatData] = useState<AnalysisData | null>(null);
  const [dataShown, setDatashown] = useState(false);

  const router = useRouter();
  const initialSearchTerm = router.query.q || "";
  useEffect(() => {
    if (initialSearchTerm) {
      setSelectedView("2");
    }
  }, [initialSearchTerm]);

  const handleAnalysisDataReceived = (data: any) => {
    setAnalysisData(data.all_chats_results);
    setChatNames(data.chat_names);
    setSelectedChatIndex(0);
    setSelectedChatData(data.all_chats_results[data.chat_names[0]]);
  };

  useEffect(() => {
    if(chatNames.length > 0) {
      setDatashown(true);
    }
  }, [chatNames]);

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
      setChatNames([]);
      setDatashown(false)
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const handleUploadError = (error: any) => {
    messageApi.open({
      type: 'error',
      content: error,
    });
  };

  return (
    <div className="bg-slate-50 p-6 sm:p-10 h-screen md:text-2xl">
      {contextHolder}
      <div className="mb-4">
        <Title>Telegram 小助手</Title>
        <Text>
          <label>上传聊天记录文件以开始</label>
        </Text>
        <Guide />
      </div>
      <UploadForm
        onAnalysisDataReceived={handleAnalysisDataReceived}
        onUploadedFileContentReceived={handleUploadedFileContent}
        onHasRemoved={handleHasRemoved}
        onErrorNotification={handleUploadError}
        dataShown={dataShown}
      />
      {chatNames.length > 0 && (
        <div className="mt-4">
          <Card className="max-w-xs">
            <Text>选择联系人</Text>
            <Dropdown
                className="mt-2"
                onValueChange={(value) => {
                  setSelectedChatIndex(value);
                  setSelectedChatData(analysisData[chatNames[value]]);
                }}
                placeholder={selectedChatData?.chat_name}
            >

            {chatNames.map((chatName, index) => (
                //@ts-ignore
                <DropdownItem key={index} value={index} text={chatName} />
              ))}
            </Dropdown>
          </Card>
          {selectedChatIndex !== null && (
            <>
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
                        chatName={selectedChatData?.chat_name || ""}
                        msgCount={selectedChatData?.msg_count || null}
                        days_have_chatted={selectedChatData?.days_have_chatted || null}
                    />
                    <div className="mb-6">
                      <ChatTrend dates={selectedChatData?.dates} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                      <HighFreqWords data={selectedChatData?.high_frequency_words} />
                      <SenderCounts data={selectedChatData?.sender_counts} />
                      <SpecialTime
                          earliest={selectedChatData?.earliest}
                          latest={selectedChatData?.latest}
                      />
                    </div>
                  </>
              ) : (
                  <Card className="mt-2">
                    <div className="h-96">
                      <Search
                          uploadedFileContent={uploadedFileContent}
                          initialSearchTerm={initialSearchTerm}
                          chatNames={chatNames}
                          selectedChatIndex={selectedChatIndex}
                      />
                    </div>
                  </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}