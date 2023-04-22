//@ts-nocheck
import React, { useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

interface UploadFormProps {
  onAnalysisDataReceived: (data: any) => void;
  onUploadedFileContentReceived: (content: any) => void;
  onHasRemoved: (hasRemoved: boolean) => void;
  onErrorNotification: (errorMessage: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  onAnalysisDataReceived,
  onUploadedFileContentReceived,
  onHasRemoved,
  onErrorNotification,
}) => {
  const [removed, setRemoved] = useState(false);

  // @ts-ignore
  const handleUpload = async ({ file, onSuccess, onError }) => {
    setRemoved(false);
    const reader = new FileReader();
    // @ts-ignore
    reader.onload = async (e) => {
      // @ts-ignore
      const content = e.target.result;
      // @ts-ignore

      const chatData = JSON.parse(content);
      onUploadedFileContentReceived(chatData);
      // Upload chat data to the server
      const formData = new FormData();
      formData.append("file", file);

      try {
        const url =
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/upload"
            : "https://tg.xyspg.moe/upload";
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Handle success
        onAnalysisDataReceived(response.data);
        onSuccess();
      } catch (error) {
        // Handle error
        console.error(error);
        onError();
        // @ts-ignore
        onErrorNotification(error.message);
      }
    };

    reader.readAsText(file);
  };

  const handleRemove = () => {
    setRemoved(true);
    onHasRemoved(true);
  };

  const props = {
    customRequest: handleUpload,
    onRemove: handleRemove,
    accept: ".json,.html",
    maxCount: 1,
  };

  // @ts-ignore
  return (
    // @ts-ignore
    <div className="max-w-xl">
      <Upload {...props}>
        <Button className="mb-4" icon={<UploadOutlined />}>
          点击上传
        </Button>
      </Upload>
    </div>
  );
};

export default UploadForm;
