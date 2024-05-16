import Uploady, { useItemFinalizeListener, useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import { asUploadButton, UploadButtonProps } from '@rpldy/upload-button';
import { forwardRef, useState } from 'react';
import { LoadingButton } from '@mui/lab';

type CustomUploadButtonProps = UploadButtonProps & ImageUploadButtonProps;

const CustomUploadButton = asUploadButton(
  forwardRef<HTMLButtonElement, CustomUploadButtonProps>(function CustomUploadButton({ onItemFinish, ...props }, ref) {
    const [loading, setLoading] = useState(false);
    useItemStartListener(() => setLoading(true));
    useItemFinishListener((item) => onItemFinish(item.uploadResponse.data.url));
    useItemFinalizeListener(() => setLoading(false));
    return (
      <LoadingButton loading={loading} {...props} ref={ref} variant="contained" color="secondary">
        Upload
      </LoadingButton>
    );
  }),
);

interface ImageUploadButtonProps {
  onItemFinish: (url: string) => void;
}

export default function ImageUploadButton({ onItemFinish }: ImageUploadButtonProps) {
  return (
    <Uploady destination={{ url: '/api/images' }} accept="image/*" multiple={false}>
      <CustomUploadButton extraProps={{ onItemFinish }} />
    </Uploady>
  );
}
