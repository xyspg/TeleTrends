import { Card, Metric, Text } from "@tremor/react";
import React from "react";

interface ChatTimesCardProps {
  earliest: string | undefined;
  latest: string | undefined;
}

const ChatTimesCard: React.FC<ChatTimesCardProps> = ({ earliest, latest }) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <Card className="max-w-xs">
        <Text>最晚</Text>
        <Metric>{latest}</Metric>
      </Card>
      <Card className="max-w-xs">
        <Text>最早</Text>
        <Metric>{earliest}</Metric>
      </Card>
    </div>
  );
};

export default ChatTimesCard;
