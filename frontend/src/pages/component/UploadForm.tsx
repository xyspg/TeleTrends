import React, { useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

interface UploadFormProps {
  onAnalysisDataReceived: (data: any) => void;
  onUploadedFileContentReceived: (content: any) => void;
  onHasRemoved: (hasRemoved: boolean) => void;
}
const UploadForm: React.FC<UploadFormProps> = ({
  onAnalysisDataReceived,
  onUploadedFileContentReceived,
    onHasRemoved
}) => {
  const [analysisData, setAnalysisData] = useState([]);
  const [uploadedFileContent, setUploadedFileContent] = useState(null);
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
      setUploadedFileContent(chatData);
      onUploadedFileContentReceived(chatData);

      // Upload chat data to the server
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle success
        setAnalysisData(response.data);
        onAnalysisDataReceived(response.data);
        onSuccess();
      } catch (error) {
        // Handle error
        console.error(error);
        onError();
      }
    };

    reader.readAsText(file);
  };

  const handleRemove = () => {
    setRemoved(true);
    onHasRemoved(true);
  }

  const props = {
    customRequest: handleUpload,
    onRemove: handleRemove,
    accept: ".json,.html",
    maxCount: 1,
  };

  return (
      // @ts-ignore
      <Upload {...props}>
      <Button icon={<UploadOutlined />}>点击上传</Button>
    </Upload>
  );
};

export default UploadForm;
