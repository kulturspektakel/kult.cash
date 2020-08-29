import {FilterDropdownProps} from 'antd/lib/table/interface';
import {Button, Space} from 'antd';
import {ControlledFilter} from './TransactionTable';
import {Select} from 'antd';

export default (cardFilter: ControlledFilter<string>) => ({
  confirm,
  clearFilters,
  filters,
}: FilterDropdownProps) => {
  const options = [...cardFilter.options].map((o: string) => (
    <Select.Option value={o} key={o}>
      {o}
    </Select.Option>
  ));

  return (
    <div style={{width: 300}}>
      <Select
        mode="multiple"
        style={{width: '100%'}}
        placeholder="Please select"
        value={[...cardFilter.values]}
        onChange={(a, ...b) => {
          console.log(a, b);
          cardFilter.addFilter(a.toString());
        }}
      >
        {options}
      </Select>
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => {
            if (clearFilters) {
              clearFilters();
            }
            confirm();
            cardFilter.onClear();
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
};
