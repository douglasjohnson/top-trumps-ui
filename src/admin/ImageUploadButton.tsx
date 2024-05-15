import Uploady, { BatchItem, useItemFinishListener } from '@rpldy/uploady';
import UploadButton from '@rpldy/upload-button';

interface UploadButtonWithHooksProps {
  onItemFinish: (item: BatchItem) => void;
}

function UploadButtonWithHooks({ onItemFinish }: UploadButtonWithHooksProps) {
  useItemFinishListener(onItemFinish);
  return <UploadButton />;
}

interface ImageUploadButtonProps {
  onItemFinish: (url: string) => void;
}

export default function ImageUploadButton({ onItemFinish }: ImageUploadButtonProps) {
  return (
    <Uploady autoUpload destination={{ url: '/api/images' }} accept="image/*" multiple={false}>
      <UploadButtonWithHooks onItemFinish={(item) => onItemFinish(item.uploadResponse.data.url)} />
    </Uploady>
  );
}
