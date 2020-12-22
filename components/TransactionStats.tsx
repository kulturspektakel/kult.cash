import {TransactionData, TransactionType} from './useData';
import {Table, Row, Col, Card, Statistic} from 'antd';
import currencyFormatter from '../utils/currencyFormatter';
import {ColumnsType} from 'antd/lib/table';
import {revenueFromTransaction} from '../utils/transaction';
import {
  ArrowUpOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {Suspense} from 'react';
import React from 'react';
import moment from 'moment';

const UNKNOWN = '(unbekannt)';

const Pie = React.lazy(() =>
  import('@ant-design/charts').then((module) => ({default: module.Pie})),
);
const StackedArea = React.lazy(() =>
  import('@ant-design/charts').then((module) => ({
    default: module.Area,
  })),
);

export enum GroupBy {
  Product,
  List,
}

type TableRow = {
  key: string;
  amount: number;
  revenue: number;
};

function color(datum: Record<string, any>): string {
  const COLOR_PLATE_20 = [
    '#5B8FF9',
    '#BDD2FD',
    '#5AD8A6',
    '#BDEFDB',
    '#5D7092',
    '#C2C8D5',
    '#F6BD16',
    '#FBE5A2',
    '#E8684A',
    '#F6C3B7',
    '#6DC8EC',
    '#B6E3F5',
    '#9270CA',
    '#D3C6EA',
    '#FF9D4D',
    '#FFD8B8',
    '#269A99',
    '#AAD8D8',
    '#FF99C3',
    '#FFD6E7',
  ];
  return COLOR_PLATE_20[
    parseInt(datum[Object.keys(datum)[0]].replace(/[^A-Za-z0-9]/g, ''), 36) %
      COLOR_PLATE_20.length
  ];
}

function groupByProdcut(
  acc: Map<string, TableRow>,
  transaction: TransactionData,
  // type: TransactionType,
) {
  let revenueFromKnownSource = 0;

  transaction.cartItems.forEach((line) => {
    const revenue = line.price * line.amount;
    revenueFromKnownSource += revenue;
    const key = line.product;
    const item = acc.get(key) ?? {
      key,
      amount: 0,
      revenue: 0,
    };
    item.revenue += revenue;
    item.amount += line.amount;
    acc.set(key, item);
  });

  const revenueFromUnknownSource =
    revenueFromKnownSource -
    revenueFromTransaction(transaction, TransactionType.Virtual);
  if (revenueFromUnknownSource > 0) {
    const item = acc.get(UNKNOWN) ?? {
      key: UNKNOWN,
      amount: 0,
      revenue: 0,
    };
    item.amount++;
    item.revenue += revenueFromUnknownSource;
    acc.set(UNKNOWN, item);
  }

  return acc;
}

function groupByList(
  acc: Map<string, TableRow>,
  transaction: TransactionData,
  // type: TransactionType,
) {
  const key = transaction.listName || UNKNOWN;
  const item = acc.get(key) ?? {
    key,
    amount: 0,
    revenue: 0,
  };
  item.amount++;
  item.revenue += revenueFromTransaction(transaction, TransactionType.Virtual);

  return acc.set(key, item);
}

export default function TransactionStats(props: {
  data: TransactionData[];
  groupBy: GroupBy;
  type: TransactionType;
}) {
  const GUTTER: [number, number] = [16, 16];

  return (
    <div>
      <Row gutter={GUTTER}>
        <Col span={4}>
          <Statistic
            title="Umsatz"
            value={
              props.data.reduce(
                (acc, cv) => acc + revenueFromTransaction(cv, props.type),
                0,
              ) / 100
            }
            precision={2}
            valueStyle={{color: '#3f8600'}}
            prefix={<ArrowUpOutlined />}
            suffix="€"
          />
        </Col>
        <Col span={4}>
          <Statistic title="Transaktionen" value={props.data.length} />
        </Col>
        <Col span={4}>
          <Statistic
            title="Pfandausgaben"
            value={props.data.reduce(
              (acc, cv) =>
                cv.tokensAfter > cv.tokensBefore
                  ? acc + cv.tokensAfter - cv.tokensBefore
                  : acc,
              0,
            )}
            prefix={<LogoutOutlined />}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Pfandrückgaben"
            value={props.data.reduce(
              (acc, cv) =>
                cv.tokensAfter < cv.tokensBefore
                  ? acc + cv.tokensBefore - cv.tokensAfter
                  : acc,
              0,
            )}
            prefix={<LoginOutlined />}
          />
        </Col>
      </Row>
      <Row gutter={GUTTER}>
        <Col span={24}>
          <RevenueOverTime
            data={props.data}
            groupBy={props.groupBy}
            type={props.type}
          />
        </Col>
      </Row>
      <Row gutter={GUTTER}>
        <ProductTable
          data={props.data}
          groupBy={props.groupBy}
          type={props.type}
        />
      </Row>
    </div>
  );
}

function ProductTable(props: {
  data: TransactionData[];
  groupBy: GroupBy;
  type: TransactionType;
}) {
  const data = props.data.reduce<Map<string, TableRow>>(
    props.groupBy === GroupBy.Product ? groupByProdcut : groupByList,
    new Map<string, TableRow>(),
  );

  const columns: ColumnsType<TableRow> = [
    {
      title: 'Produkt',
      dataIndex: 'key',
    },
    {
      title: 'Anzahl',
      dataIndex: 'amount',
      align: 'right',
    },
    {
      title: 'Umsatz',
      dataIndex: 'revenue',
      align: 'right',
      render: (p) => currencyFormatter.format(p / 100),
    },
  ];

  return (
    <>
      <Col span={8}>
        <Table<TableRow>
          bordered
          pagination={false}
          size="small"
          columns={columns}
          dataSource={Array.from<TableRow>(data.values()).sort(
            (a, b) => b.revenue - a.revenue,
          )}
          rowKey="key"
        />
      </Col>
      <Col span={8}>
        <Card title="Anzahl" size="small">
          <Suspense fallback={null}>
            <Pie
              radius={0.8}
              data={Array.from<TableRow>(data.values()).map((v) => ({
                type: v.key,
                value: v.amount,
              }))}
              label={{
                type: 'outer',
                content: '{name}',
              }}
              angleField="value"
              colorField="type"
              color={color}
              legend={false}
            />
          </Suspense>
        </Card>
      </Col>
    </>
  );
}

function RevenueOverTime(props: {
  data: TransactionData[];
  groupBy: GroupBy;
  type: TransactionType;
}) {
  const timeGroup = 3600000;
  let min = Infinity;
  let max = -Infinity;

  const hours = props.data.reduce<Map<number, Map<string, TableRow>>>(
    (acc, transaction) => {
      const hour = Math.round(
        new Date(transaction.deviceTime).getTime() / timeGroup,
      );
      min = Math.min(min, hour);
      max = Math.max(max, hour);

      if (!acc.has(hour)) {
        acc.set(hour, new Map());
      }

      const childMap = acc.get(hour)!;
      if (props.groupBy === GroupBy.Product) {
        groupByProdcut(childMap, transaction /*, props.type*/);
      } else {
        groupByList(childMap, transaction /*, props.type*/);
      }
      return acc;
    },
    new Map(),
  );

  const groups = new Set<string>(
    Array.from(hours.values()).flatMap((map) => Array.from(map.keys())),
  );

  // generate 0 values
  const data: Array<{
    hour: string;
    revenue: number;
    type: string;
  }> = [];
  for (let i = min; i <= max; i++) {
    for (const group of groups) {
      data.push({
        hour: moment(i * timeGroup).format('dd HH:00'),
        revenue: (hours.get(i)?.get(group)?.revenue ?? 0) / 100,
        type: group,
      });
    }
  }

  return (
    <Card title="Umsatz" size="small">
      <Suspense fallback={null}>
        <StackedArea
          data={data}
          xField="hour"
          yField="revenue"
          // stackField="type"
          color={color}
        />
      </Suspense>
    </Card>
  );
}
