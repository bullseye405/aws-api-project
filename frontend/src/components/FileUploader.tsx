import {
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useRef, useState } from 'react';

function FileUploader({ apiUrl }: { apiUrl: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getToken = async () => {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? '';
  };

  const handleFileUpload = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);

      const token = await getToken();

       const uploadPromises =  files.map(async (file) => {
          // 1️⃣ Get presigned URL
          const res = await fetch(apiUrl + 'get-upload-url', {
            method: 'POST',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
            }),
          });

          const { uploadUrl } = await res.json();

          // 2️⃣ Upload file to S3
          await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });
        });
        await Promise.all(uploadPromises)

      alert('All files uploaded successfully!');
      setFiles([]);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card
      variation="outlined"
      padding="2rem"
      maxWidth="600px"
      margin="2rem auto"
    >
      <Flex direction="column" gap="1rem">
        <Heading level={4}>Upload Files</Heading>

        <View
          border="2px dashed"
          borderColor="border.primary"
          borderRadius="medium"
          padding="2rem"
          textAlign="center"
          style={{ cursor: 'pointer' }}
          onClick={() => inputRef.current?.click()}
        >
          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Text fontSize="1.2rem">📁 Drag & Drop Files</Text>
            <Text color="font.secondary">or click to browse</Text>
          </Flex>
        </View>

        <input
          type="file"
          multiple
          hidden
          ref={inputRef}
          onChange={handleSelect}
        />

        {files.length > 0 && <Divider />}

        {files.map((file, index) => (
          <Flex
            key={index}
            justifyContent="space-between"
            alignItems="center"
            padding="0.5rem"
            border="1px solid"
            borderColor="border.primary"
            borderRadius="small"
          >
            <Flex direction="column">
              <Text fontWeight="bold">{file.name}</Text>
              <Text fontSize="0.8rem" color="font.secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Text>
            </Flex>

            <Button
              variation="destructive"
              size="small"
              onClick={() => removeFile(index)}
            >
              Remove
            </Button>
          </Flex>
        ))}

        {files.length > 0 && (
          <Button
            variation="primary"
            onClick={handleFileUpload}
            isLoading={uploading}
          >
            Upload {files.length} file{files.length > 1 ? 's' : ''}
          </Button>
        )}
      </Flex>
    </Card>
  );
}

export default FileUploader;
