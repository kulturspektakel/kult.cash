import {FilterDropdownProps} from 'antd/lib/table/interface';
import {Button, Space} from 'antd';
import {Select} from 'antd';

export default function CardFilter({
  confirm,
  clearFilters,
  setSelectedKeys,
  filters,
  selectedKeys,
  cards,
}: FilterDropdownProps & {cards: Set<string>}) {
  const options = [...cards].map((o) => (
    <Select.Option value={o} key={o}>
      {o}
    </Select.Option>
  ));

  return (
    <div style={{width: 300}}>
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
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            // setSelectedKeys();
            if (clearFilters) {
              // console.log(clearFilters);
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
      </Space>
    </div>
  );
}
