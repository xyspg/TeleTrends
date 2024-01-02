//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { WordTokenizer } from "natural";
import { removeStopwords, eng } from "stopword";
import { parseISO, format } from "date-fns";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Error parsing the form data." });
      return;
    }

    const file = files.file as formidable.File;
    const content = fs.readFileSync(file.filepath, "utf-8");
    const allData = JSON.parse(content);

    const all_chats_results = {};
    for (const chatData of allData.chats.list) {
      const dates = chatData.messages.map((msg: any) => parseDate(msg.date));

      const allText = chatData.messages
        .flatMap((msg: any) =>
          msg.text_entities
            .filter((entity: any) => entity.type === "plain")
            .map((entity: any) => entity.text.replace(/“|”/g, '"')),
        )
        .join(" ");

      const tokenizer = new WordTokenizer();
      const tokens = tokenizer.tokenize(allText);
      if (!tokens) {
        return;
      }
      const stopWordsRemoved = removeStopwords(tokens!);
      const numbersRemoved = stopWordsRemoved.filter(
        (token) => !/^\d+$/.test(token),
      );
      const filteredTokens = numbersRemoved.filter(
        (token) => !/^\p{Punctuation}+$/u.test(token),
      );

      // High-frequency words
      const freqDist: { [key: string]: number } = {};
      filteredTokens.forEach((token) => {
        freqDist[token] = (freqDist[token] || 0) + 1;
      });
      const highFrequencyWords = Object.entries(freqDist)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 100);

      // Basic information
      let chatName = chatData.name || "Saved Messages";
      if (chatName === "null" || chatName == null) {
        chatName = "Deleted Account";
      }

      const msgCount = chatData.messages.length;
      const daysHaveChatted = new Set(
        chatData.messages.map((msg: any) => msg.date.split("T")[0]),
      ).size;

      // Sender statistics
      const senderCounts: { [key: string]: number } = {};
      chatData.messages.forEach((msg: any) => {
        if (msg.from) {
          senderCounts[msg.from] = (senderCounts[msg.from] || 0) + 1;
        }
      });

      const messageTimes = chatData.messages.map(
        (msg: { date: string | number | Date }) => {
          return new Date(msg.date).getTime();
        },
      );


      // Define time constraints
      const lateNightStart = new Date();
      lateNightStart.setHours(0, 0, 0, 0);
      const lateNightEnd = new Date();
      lateNightEnd.setHours(5, 0, 0, 0);
      const earlyMorningStart = new Date();
      earlyMorningStart.setHours(5, 0, 0, 0);
      const earlyMorningEnd = new Date();
      earlyMorningEnd.setHours(9, 0, 0, 0);
      console.log(lateNightStart);

      // Filter chat times within the constraints
      const lateNightTimes = messageTimes.filter((t) => {
        const time = new Date(t);
        return time >= lateNightStart && time < lateNightEnd;
      });
      const earlyMorningTimes = messageTimes.filter((t) => {
        const time = new Date(t);
        return time >= earlyMorningStart && time < earlyMorningEnd;
      });

      // Find the earliest and latest chat times
      const latestTime = lateNightTimes.length
        ? new Date(Math.max(...lateNightTimes))
        : null;
      const earliestTime = earlyMorningTimes.length
        ? new Date(Math.min(...earlyMorningTimes))
        : null;

      // @ts-ignore
      all_chats_results[chatName] = {
        chat_name: chatName,
        msg_count: msgCount,
        days_have_chatted: daysHaveChatted,
        earliest: earliestTime ? format(earliestTime, "HH:mm:ss") : null,
        latest: latestTime ? format(latestTime, "HH:mm:ss") : null,
        sender_counts: senderCounts,
        high_frequency_words: highFrequencyWords,
        dates,
      };
    }

    res
      .status(200)
      .json({ chat_names: Object.keys(all_chats_results), all_chats_results });
  });
}

function parseDate(dateStr: string): string {
  const time = parseISO(dateStr);
  return format(time, "yyyy-MM-dd'T'HH:mm:ss");
}
