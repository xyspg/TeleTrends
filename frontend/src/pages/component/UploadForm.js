import React, { useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadForm = ({ onAnalysisDataReceived }) => {
  const [analysisData, setAnalysisData] = useState([]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
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

  const props = {
    customRequest: handleUpload,
    accept: ".json",
    maxCount: 1,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

export default UploadForm;
