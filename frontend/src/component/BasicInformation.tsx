import React from "react";
import { Card, Metric, Text } from "@tremor/react";

interface BasicInformationProps {
  chatName: string;
  msgCount: number;
  days_have_chatted: number;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ chatName, msgCount, days_have_chatted }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 md:max-w-4xl">
        <Card className="">
          <Text>昵称</Text>
          <Metric className='mt-1'>{chatName}</Metric>
        </Card>
        <Card className="">
          <Text>消息总数</Text>
          <Metric className='mt-1'>{msgCount}</Metric>
        </Card>
        <Card className="">
          <Text>聊天天数</Text>
          <Metric className='mt-1'>{days_have_chatted}</Metric>
        </Card>
      </div>
    </>
  );
  
  
};

export default BasicInformation;
