import { Card, List, ListItem, Title } from "@tremor/react";

const HighFreqWords = ({ data }) => {
    return (
        <Card className="max-w-xs">
            <Title>High Frequency Words</Title>
            <List>
                {data.map(([word, frequency]) => (
                    <ListItem key={word}>
                        <span>{word}</span>
                        <span>{frequency}</span>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
};

export default HighFreqWords;
