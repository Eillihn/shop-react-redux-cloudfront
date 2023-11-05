import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios, {AxiosRequestHeaders} from 'axios';
import Alert from '@mui/material/Alert';

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [hasError, setHasError] = React.useState<boolean>(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log('uploadFile to', url);
    const authorization_token = localStorage.getItem('authorization_token');
    const requestParams = {
      method: 'GET',
      url,
      headers: {} as unknown as AxiosRequestHeaders,
      params: {
        name: encodeURIComponent(file?.name || ''),
      }
    };

    if (authorization_token) {
      requestParams.headers.Authorization = `Basic ${authorization_token}`;
    }
    setHasError(false);

    const response = await axios(requestParams).catch(function (error) {
      setHasError(true);
      return error;
    });
    console.log('File to upload: ', file?.name);
    console.log('Uploading to: ', response.data);
    const result = await fetch(response.data, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: file,
    });
    console.log('Result: ', result);
    setFile(file);
  };
  return (
    <Box>
      {hasError && <Alert severity='error'>Authorization error</Alert>}
      <Typography variant='h6' gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type='file' onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
