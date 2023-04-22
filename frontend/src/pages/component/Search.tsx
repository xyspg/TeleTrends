//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
} from "@tremor/react";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import ClipboardJS from "clipboard";

interface SearchProps {
  uploadedFileContent: any;
  initialSearchTerm: string | string[];
  selectedChatIndex: number | null;
  chatNames: string[];
}

interface Message {
    text: any;
    from: string;
    date: string;
    item: any;
}

const Search: React.FC<SearchProps> = ({
                                           uploadedFileContent,
                                           initialSearchTerm,
                                           selectedChatIndex,
                                           chatNames,
                                       }) => {
    const [filteredMessages, setFilteredMessages] = useState([]);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    const clipboardRef = useRef(null);

    useEffect(() => {
        clipboardRef.current = new ClipboardJS('.cursor-copy');
        return () => {
            if (clipboardRef.current) {
                clipboardRef.current.destroy();
            }
        };
    }, []);

    const searchMessages = () => {
        if (uploadedFileContent && selectedChatIndex !== null) {
            const selectedChatData =
              uploadedFileContent.chats.list[selectedChatIndex];
            if (selectedChatData) {
                const filtered = selectedChatData.messages.filter((message: Message) => {
                    if (!message.text) return false;

                    if (Array.isArray(message.text)) {
                        return message.text.some((item: any) =>
                            item.type === 'plain' && item.text.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    } else {
                        return message.text.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                });
                setFilteredMessages(filtered);
            }
        }
    };


    useEffect(() => {
        if (searchTerm !== '') {
            searchMessages();
        } else {
            setFilteredMessages([]);
        }
    }, [searchTerm, uploadedFileContent, selectedChatIndex]);

    const SearchOnEnterKey = (e: any) => {
        if (e.key === 'Enter') {
            searchMessages();
        }
    };

    return (
        <>
        <div>
            <TextInput
                icon={SearchIcon}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={SearchOnEnterKey}
                autoComplete="off"
            />
        </div>
            {filteredMessages.length > 0 ? (
                <Card className='mt-2'>
                    <Table className='mt-5'>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>发送者</TableHeaderCell>
                                <TableHeaderCell>时间</TableHeaderCell>
                                <TableHeaderCell>内容</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMessages &&
                                filteredMessages.map((message: Message, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{message.from ? message.from : ''}</TableCell>
                                        <TableCell>
                                            {message.date ? message.date.replace('T', ' ') : ''}
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className='cursor-copy hover:text-slate-800 transition'
                                                data-clipboard-text={message.text}
                                            >
                                                {Array.isArray(message.text)
                                                    ? message.text
                                                        .filter((item: any) => item.type === 'plain')
                                                        .map((item: any) => item.text)
                                                        .join(' ')
                                                    : message.text}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : searchTerm !== '' ? (
                <Text className='mt-4'>未找到与“{searchTerm}”相关的内容</Text>
            ) : null}
</>
);
};

export default Search;

