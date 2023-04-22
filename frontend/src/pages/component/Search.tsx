//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { StatusOnlineIcon } from '@heroicons/react/outline';
import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Title,
    Badge,
} from '@tremor/react';
import { TextInput } from '@tremor/react';
import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import ClipboardJS from 'clipboard';

interface SearchProps {
    uploadedFileContent: any;
    initialSearchTerm: string | string[];
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
                                       }) => {
    const [filteredMessages, setFilteredMessages] = useState([]);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchCalled, setSearchCalled] = useState(false);
    const [text, setText] = useState('');
    const clipboardRef = useRef(null);

    useEffect(() => {
        clipboardRef.current = new ClipboardJS('.cursor-copy');
        return () => {
            if (clipboardRef.current) {
                clipboardRef.current.destroy();
            }
        };
    }, []);

    const searchMessages = (searchTerm: string) => {
        setSearchPerformed(true);
        setSearchCalled(true);
        if (uploadedFileContent) {
            const filtered = uploadedFileContent.messages.filter(
                (message: Message) => {
                    if (!message.text) return false;

                    if (typeof message.text === 'string') {
                        return message.text.includes(searchTerm);
                    } else {
                        // @ts-ignore
                        return message.text.some(
                            (item) => item.type === 'plain' && item.text.includes(searchTerm)
                        );
                    }
                }
            );
            if (searchTerm) {
                setFilteredMessages(filtered);
                setText(searchTerm);
            } else {
                setFilteredMessages([]);
            }
        }
    };

    useEffect(() => {
        if (initialSearchTerm) {
            setSearchPerformed(true);
            setSearchCalled(true);
        }
    }, [initialSearchTerm]);

    useEffect(() => {
        if (searchPerformed) {
            searchMessages(searchTerm);
        }
    }, [searchPerformed, searchTerm, uploadedFileContent]);

    const SearchOnEnterKey = (e: any) => {
        if (e.key === 'Enter') {
            searchMessages(searchTerm);
        }
    };

    return (
        <>
            <div>
                <TextInput
                    icon={SearchIcon}
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={SearchOnEnterKey}
                    autoComplete='off'
                />
            </div>
            {filteredMessages.length > 0 ? (
                <Card className='mt-4'>
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
            ) : searchTerm !== '' && searchPerformed && searchCalled ? (
                <Text className='mt-4'>未找到与“{text}”相关的内容</Text>
            ) : null}
        </>
    );
};

export default Search;
