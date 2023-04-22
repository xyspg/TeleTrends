import { Card, Title, BarChart } from "@tremor/react";

// @ts-ignore
const processDates = (dates) => {
    // @ts-ignore
    const countsByDay = dates.reduce((acc, dateStr) => {
        const date = new Date(dateStr);
        const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});
BarChart
    return Object.entries(countsByDay).map(([day, count]) => ({ day, "发送消息（条）": count }));
};

// @ts-ignore
const ChatTrends = ({ dates = [] }) => {
  const processedData = dates ? processDates(dates) : [];
    return (
        <Card>
            <Title>聊天趋势</Title>
            <BarChart
                data={processedData}
                index="day"
                categories={["发送消息（条）"]}
                colors={["blue"]}
                yAxisWidth={40}
            />
        </Card>
    );
};

export default ChatTrends;
