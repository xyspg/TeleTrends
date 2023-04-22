import { BarList, Button, Card, Title } from "@tremor/react";
import React from "react";

interface HighFreqWordsProps {
  data: [string, number][]; // [word, frequency]
}

const HighFreqWords: React.FC<HighFreqWordsProps> = ({ data = [] }) => {
  const [itemsToShow, setItemsToShow] = React.useState(10);
  const handleShowMore = () => {
    setItemsToShow((prevItemsToShow) => prevItemsToShow + 20);
  };

  const barData = data
    .slice(0, itemsToShow)
    .map(([name, value]) => ({ name, value }));

  return (
    <>
      <Card className="max-w-xs">
        <Title className="mb-2">高频词</Title>
        <BarList data={barData} showAnimation={true} />
        {itemsToShow < data.length && (
          <div className="mt-4 text-center">
            <Button onClick={handleShowMore}>显示更多</Button>
          </div>
        )}
      </Card>
    </>
  );
};

export default HighFreqWords;
