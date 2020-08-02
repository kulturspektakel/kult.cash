import {Table} from 'antd';
import {Device, List} from '@prisma/client';
import {Select} from 'antd';
import memoize from 'lodash.memoize';
import App from '../../components/App';
import {fetcher} from '../../utils/swrConfig';
import {getAPIUrl, useDevices} from '../../components/useData';
import RelativeDate from '../../components/RelativeDate';
import {getInitialLists, getInitialDevices} from '../../utils/initialProps';
import {NextPageContext} from 'next';
import useSWR from 'swr';
import {updateDevice} from '../../utils/mutations';
const {Option} = Select;

const getColumns = memoize((lists: List[] | null, updateDevice) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '25%',
    render: (id: string) => <strong>{id}</strong>,
  },
  {
    title: 'Preisliste',
    dataIndex: 'listName',
    key: 'listName',
    width: '25%',
    render: (listName: string | null, device: Device) => (
      <Select
        style={{display: 'block'}}
        dropdownMatchSelectWidth={false}
        defaultValue={listName ?? ''}
        onChange={(name: string | null) =>
          updateDevice({
            id: device.id,
            list: name
              ? {
                  connect: name ? {name} : null,
                }
              : {disconnect: true},
          })
        }
      >
        <Option value={''}>keine Preisliste</Option>
        {(lists || []).map((list) => (
          <Option key={list.name} value={list.name}>
            {list.name}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    title: 'Zuletzt online',
    dataIndex: 'lastSeen',
    key: 'age',
    width: '25%',
    render: RelativeDate,
  },
  {
    title: 'Software',
    dataIndex: 'latestVersion',
    key: 'latestVersion',
    width: '25%',
  },
]);

export default function Devices({
  initialLists,
  initialDevices,
}: {
  initialLists?: List[];
  initialDevices?: Device[];
}) {
  // const {updateItem: updateDevice} = useDevices(initialDevices);
  const {data: lists} = useSWR(getAPIUrl('lists'), fetcher, {
    initialData: initialLists,
  });
  const {data: devices} = useSWR(getAPIUrl('devices'), fetcher, {
    initialData: initialDevices,
  });

  return (
    <App>
      <Table
        loading={!devices}
        columns={getColumns(lists, updateDevice)}
        dataSource={devices ?? undefined}
        pagination={false}
        rowKey="id"
      />
    </App>
  );
}

Devices.getInitialProps = async ({req}: NextPageContext) => {
  const [initialLists, initialDevices] = await Promise.all([
    getInitialLists(req),
    getInitialDevices(req),
  ]);
  return {initialLists, initialDevices};
};
