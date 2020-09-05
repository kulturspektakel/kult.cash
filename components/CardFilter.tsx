import {FilterDropdownProps} from 'antd/lib/table/interface';
import {Button, Select} from 'antd';
import styles from './CardFilter.module.css';

export default function CardFilter({
  confirm,
  clearFilters,
  setSelectedKeys,
  selectedKeys,
  cards,
}: FilterDropdownProps & {cards: string[]}) {
  const options = cards.map((o) => (
    <Select.Option value={o} key={o}>
      {o}
    </Select.Option>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          type="link"
          size="small"
          disabled={selectedKeys.length === 0}
          onClick={() => {
            if (clearFilters) {
              clearFilters();
            }
            confirm();
          }}
        >
          Reset
        </Button>
        <Button size="small" type="primary" onClick={() => confirm()}>
          OK
        </Button>
      </div>
      <div className={styles.padder}>
        <Select
          mode="multiple"
          style={{width: '100%'}}
          placeholder="Karten ID"
          value={selectedKeys}
          onChange={(values) => {
            setSelectedKeys(values);
          }}
        >
          {options}
        </Select>
      </div>
    </div>
  );
}
