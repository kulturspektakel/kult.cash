import {FilterDropdownProps} from 'antd/lib/table/interface';
import {Button, DatePicker, Space} from 'antd';
import {useCallback} from 'react';
import styles from './TimeFilter.module.css';
import moment, {Moment} from 'moment';
import {useRecoilState} from 'recoil';
import {dateRangeFilterAtom} from '../pages/dashboard/transactions';
const {RangePicker} = DatePicker;

export default function TimeFilter({
  clearFilters,
  confirm,
  setSelectedKeys,
  selectedKeys: [timeFrom, timeUntil],
}: FilterDropdownProps) {
  const [_dateRangeFilter, setDateRangeFilter] = useRecoilState(
    dateRangeFilterAtom,
  );

  const onDone = useCallback(() => {
    setDateRangeFilter([timeFrom, timeUntil]);
    confirm();
  }, [setDateRangeFilter, confirm, timeFrom, timeUntil]);

  const onChange = useCallback(
    ([from, to]: [Moment, Moment]) => {
      setSelectedKeys([from.unix() * 1000, to.unix() * 1000]);
    },
    [setSelectedKeys],
  );

  return (
    <div className={styles.root}>
      <RangePicker
        className={styles.picker}
        showTime={{format: 'HH:mm'}}
        format="DD.MM.YYYY HH:mm"
        placeholder={['von', 'bis']}
        onChange={onChange}
        // @ts-ignore
        value={timeFrom ? [moment(timeFrom), moment(timeUntil)] : undefined}
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
