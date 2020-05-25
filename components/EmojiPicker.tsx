import {Button, Popover} from 'antd';
import {Emoji, Picker, EmojiData} from 'emoji-mart';
import {useState} from 'react';
import styles from './EmojiPicker.module.css';

export default function EmojiPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (emoji: string) => void;
}) {
  const [pickerVisible, setPickerVisible] = useState(false);
  return (
    <Popover
      className={styles.root}
      placement="topLeft"
      visible={pickerVisible}
      onVisibleChange={setPickerVisible}
      overlayClassName={styles.overlay}
      content={
        <Picker
          color="#4591F7"
          title=""
          showSkinTones={false}
          style={{border: 0}}
          exclude={['recent']}
          emoji={value ?? ''}
          onSelect={({colons}) => {
            setPickerVisible(false);
            onChange(colons);
          }}
        />
      }
      trigger="click"
    >
      <Button
        shape="circle"
        icon={
          <div className={styles.emoji}>
            <Emoji emoji={value ?? ''} size={24} />
          </div>
        }
        size="large"
        onClick={() => setPickerVisible(!pickerVisible)}
      />
    </Popover>
  );
}
