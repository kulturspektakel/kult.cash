import {FilterDropdownProps} from 'antd/lib/table/interface';
import {Button, DatePicker, Space} from 'antd';
import {useCallback} from 'react';
import styles from './TimeFilter.module.css';
import moment, {Moment} from 'moment';
import {useRecoilState, atom} from 'recoil';
const {RangePicker} = DatePicker;
export type DateRange = [Moment | null, Moment | null];

export const dateRangeFilterAtom = atom<DateRange>({
  key: 'dateRangeFilter',
  default: [null, null],
});

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
    setDateRangeFilter([moment(timeFrom), moment(timeUntil)]);
    confirm();
  }, [setDateRangeFilter, confirm, timeFrom, timeUntil]);

  const onChange = useCallback(
    ([a, b]: DateRange) => {
      const from = a ? a.unix() * 1000 : null;
      const to = b ? b.unix() * 1000 : null;
      // setSelectedKeys([from, to]);
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
        // onChange={onChange}
        // value={
        //   timeFrom
        //     ? ([moment(timeFrom), moment(timeUntil)] as const)
        //     : undefined
        // }
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
