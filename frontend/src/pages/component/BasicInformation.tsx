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
      <div className="flex flex-row justify-around mb-4">
        <Card className="max-w-xs mx-auto">
          <Text>Name</Text>
          <Metric>{chatName}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto">
          <Text>Message Count</Text>
          <Metric>{msgCount}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto">
          <Text>Days Chatted</Text>
          <Metric>{days_have_chatted}</Metric>
        </Card>
      </div>
    </>
  );
};

export default BasicInformation;
