import {FilterDropdownProps} from 'antd/lib/table/interface';
import {Button, DatePicker, Space} from 'antd';
import {useCallback, useState} from 'react';
import styles from './TimeFilter.module.css';
import {Moment} from 'moment';

const {RangePicker} = DatePicker;
export type DateRange = [Moment | null, Moment | null];

export default function TimeFilter({
  clearFilters,
  confirm,
  setSelectedKeys,
  selectedKeys,
}: FilterDropdownProps) {
  const value: DateRange | undefined = selectedKeys[0] as any;
  const [local, setLocal] = useState<DateRange | undefined>(value);
  const onDone = useCallback(() => {
    if (local) {
      setSelectedKeys([local as any]);
    }
    confirm();
  }, [confirm, setSelectedKeys, local]);

  return (
    <div className={styles.root}>
      <RangePicker
        className={styles.picker}
        showTime={{format: 'HH:mm'}}
        format="DD.MM.YYYY HH:mm"
        placeholder={['von', 'bis']}
        onChange={setLocal as any}
        value={value as any}
      />
      <Space className={styles.buttons}>
        <Button size="small" type="ghost" onClick={clearFilters}>
          Reset
        </Button>
        <Button size="small" type="primary" onClick={onDone}>
          OK
        </Button>
      </Space>
    </div>
  );
}
