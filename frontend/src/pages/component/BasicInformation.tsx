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
      <div className="flex flex-row justify-center lg:justify-start gap-4 mb-4">
        <Card className="max-w-xs mx-auto">
          <Text>昵称</Text>
          <Metric className='mt-1'>{chatName}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto">
          <Text>消息总数</Text>
          <Metric className='mt-1'>{msgCount}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto">
          <Text>聊天天数</Text>
          <Metric className='mt-1'>{days_have_chatted}</Metric>
        </Card>
      </div>
    </>
  );
  
  
};

export default BasicInformation;
