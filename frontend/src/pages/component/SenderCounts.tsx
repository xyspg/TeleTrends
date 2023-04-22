import { Card, Title, BarList } from "@tremor/react";
import React from "react";

interface SenderCountsProps {
    data: { [sender: string]: number }; // {sender: count}
}

const SenderCounts: React.FC<SenderCountsProps> = ({ data = {} }) => {
    //list the data from max to min
    const barData = Object.entries(data).map(([name, value]) => ({ name, value }));
    barData.sort((a, b) => b.value - a.value);

    return (
        <Card className="max-w-xs">
            <Title className='mb-2'>对话分布</Title>
            <BarList data={barData} />
        </Card>
    );
};

export default SenderCounts;
