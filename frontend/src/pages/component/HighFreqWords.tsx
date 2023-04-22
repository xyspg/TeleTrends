import { Card, List, ListItem, Title, BarList } from "@tremor/react";
import React from "react";

interface HighFreqWordsProps {
    data: [string, number][]; // [word, frequency]
}
const HighFreqWords:React.FC<HighFreqWordsProps> = ({ data = [] }) => {
    const barData = data.map(([name, value]) => ({ name, value }));

    return (
        <Card className="max-w-xs">
            <Title className='mb-2'>高频词</Title>
            <BarList data={barData}
            showAnimation={true}
            />
        </Card>
    );
};

export default HighFreqWords;
