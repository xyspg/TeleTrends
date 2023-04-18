import { Card, Title, LineChart } from "@tremor/react";

// @ts-ignore
const processDates = (dates) => {
    const countsByDay = dates.reduce((acc, dateStr) => {
        const date = new Date(dateStr);
        const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(countsByDay).map(([day, count]) => ({ day, "Message Sent": count }));
};

// @ts-ignore
const ChatTrends = ({ dates }) => {
    const processedData = processDates(dates);

    return (
        <Card>
            <Title>Chat Trend</Title>
            <LineChart
                data={processedData}
                index="day"
                categories={["Message Sent"]}
                colors={["blue"]}
                yAxisWidth={40}
            />
        </Card>
    );
};

export default ChatTrends;
