import { useEffect, useState } from 'react';
import {
  Card,
  Flex,
  Grid,
  Image,
  Text,
  View,
  Loader,
  Heading,
  Button,
} from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';

type FileItem = {
  key: string;
  url: string;
  fileName: string;
};

interface FileGridProps {
  apiUrl: string;
}

function FileGrid({ apiUrl }: FileGridProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  const getFileExtension = (name: string) =>
    name.split('.').pop()?.toLowerCase() || '';

  const getFileIcon = (ext: string) => {
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext)) return '📄';
    if (['zip', 'rar'].includes(ext)) return '📦';
    if (['mp4', 'mov'].includes(ext)) return '🎬';
    return '📁';
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);

        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const response = await fetch(`${apiUrl}/list-files`, {
          headers: { Authorization: token || '' },
        });

        const data = await response.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [apiUrl]);

  const handleDelete = (file: FileItem) => {
    console.log('Delete clicked:', file);
    // TODO: implement delete API later
  };

  if (loading) {
    return (
      <Flex justifyContent="center" padding="4rem" gap="1rem">
        <Loader size="large" />
        <Text>Loading your vault...</Text>
      </Flex>
    );
  }

  if (files.length === 0) {
    return (
      <View textAlign="center" padding="4rem">
        <Heading level={4}>Your vault is empty</Heading>
        <Text>Upload some files to see them here!</Text>
      </View>
    );
  }

  return (
    <View padding="2rem">
      <Heading level={3} marginBottom="1.5rem">
        My Private Gallery
      </Heading>

      <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap="1rem">
        {files.map((file) => {
          const ext = getFileExtension(file.fileName);
          const isImage = imageExtensions.includes(ext);

          return (
            <Card key={file.key} variation="outlined" padding="0.5rem">
              <Flex direction="column" gap="0.5rem">
                {/* Preview */}
                {isImage ? (
                  <Image
                    src={file.url}
                    alt={file.fileName}
                    objectFit="cover"
                    height="140px"
                    borderRadius="small"
                  />
                ) : (
                  <Flex
                    height="140px"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="3rem"
                    backgroundColor="background.secondary"
                    borderRadius="small"
                  >
                    {getFileIcon(ext)}
                  </Flex>
                )}

                {/* File name + delete */}
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="0.9rem" fontWeight="bold" isTruncated>
                    {file.fileName}
                  </Text>

                  <Button
                    size="small"
                    variation="destructive"
                    onClick={() => handleDelete(file)}
                  >
                    x
                  </Button>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Grid>
    </View>
  );
}

export default FileGrid;
