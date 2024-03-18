import React, { useRef, useState } from "react";
import axios from "axios";
import { Progress } from "antd";
import { Button } from "../../components/ui/button";

interface UploadFormProps {
  onAnalysisDataReceived: (data: any) => void;
  onUploadedFileContentReceived: (content: any) => void;
  onHasRemoved: (hasRemoved: boolean) => void;
  onErrorNotification: (errorMessage: string) => void;
  dataShown: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({
  onAnalysisDataReceived,
  onUploadedFileContentReceived,
  onHasRemoved,
  onErrorNotification,
  dataShown,
}) => {
  const [removed, setRemoved] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setRemoved(false);
    setUploadProgress(0);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        try {
          const chatData = JSON.parse(content);
          onUploadedFileContentReceived(chatData);
        } catch (e) {
          onErrorNotification("文件结构有误，请检查导出文件是否完整")
        }
      }
      const formData = new FormData();
      formData.append("file", file);

      try {
        const url = '/api/upload'
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        // Handle success
        onAnalysisDataReceived(response.data);
      } catch (error: any) {
        // Handle error
        console.error(error);
        onErrorNotification(error.message);
      }
    };

    reader.readAsText(file);
  };

  const handleRemove = () => {
    setRemoved(true);
    onHasRemoved(true);
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="max-w-xl flex flex-row gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.html"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={handleUploadClick} variant={"outline"}>
          上传文件
        </Button>

        <Button variant={"outline"} onClick={handleRemove}>
          删除文件
        </Button>
      </div>
      {uploadProgress > 0 && (
        <Progress percent={uploadProgress} className="max-w-md" />
      )}
      {uploadProgress === 100 && !dataShown && (
        <div className="text-green-500 text-lg">上传完成，正在分析中......</div>
      )}
    </>
  );
};
export default UploadForm;
