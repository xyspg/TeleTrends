import { Card, Metric, Text } from "@tremor/react";
import React from "react";

interface ChatTimesCardProps {
  earliest: string;
  latest: string;
}

const ChatTimesCard: React.FC<ChatTimesCardProps> = ({ earliest, latest }) => {
  return (
    <div className="flex flex-col gap-4-myself">
      <Card className="max-w-xs mx-auto">
        <Text>最晚</Text>
        <Metric>{latest}</Metric>
      </Card>
      <Card className="max-w-xs mx-auto">
        <Text>最早</Text>
        <Metric>{earliest}</Metric>
      </Card>
    </div>
  );
};

export default ChatTimesCard;
