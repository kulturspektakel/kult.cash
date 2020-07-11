import {TransactionData} from './useData';
import {Table, Row, Col, Card, Statistic} from 'antd';
import currencyFormatter from '../utils/currencyFormatter';
import {ColumnsType} from 'antd/lib/table';
import {revenueFromTransaction} from '../utils/transaction';
import {ArrowUpOutlined} from '@ant-design/icons';
import {useEffect, Suspense} from 'react';
import React from 'react';
import moment from 'moment';

const UNKNOWN = '(unbekannt)';

const Pie = React.lazy(() =>
  import('@ant-design/charts').then((module) => ({default: module.Pie})),
);
const Area = React.lazy(() =>
  import('@ant-design/charts').then((module) => ({
    default: module.Area,
  })),
);

type TableRow = {
  product: string;
  amount: number;
  revenue: number;
};

export default function TransactionStats(props: {data: TransactionData[]}) {
  const GUTTER: [number, number] = [16, 16];
  const data = props.data.reduce((acc, transaction) => {
    let revenueFromKnownSource = 0;
    transaction.cartItems.forEach((line) => {
      const revenue = line.price * line.amount;
      revenueFromKnownSource += revenue;
      return acc.set(line.product, {
        product: line.product,
        amount: (acc.get(line.product)?.amount ?? 0) + line.amount,
        revenue: (acc.get(line.product)?.revenue ?? 0) + revenue,
      });
    });

    const revenueFromUnknownSource =
      revenueFromKnownSource - revenueFromTransaction(transaction);
    if (revenueFromUnknownSource > 0) {
      acc.set(UNKNOWN, {
        product: UNKNOWN,
        amount: (acc.get(UNKNOWN)?.amount ?? 0) + 1,
        revenue: (acc.get(UNKNOWN)?.revenue ?? 0) + revenueFromUnknownSource,
      });
    }

    return acc;
  }, new Map<string, TableRow>());

  return (
    <div>
      <Row gutter={GUTTER}>
        <Col span={4}>
          <Statistic
            title="Umsatz"
            value={
              props.data.reduce(
                (acc, cv) => acc + revenueFromTransaction(cv),
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
          />
        </Col>
      </Row>
      <Row gutter={GUTTER}>
        <Col span={8}>
          <ProductTable data={data} />
        </Col>
        <Col span={8}>
          <ProductPieChart data={data} />
        </Col>
      </Row>
      <Row gutter={GUTTER}>
        <Col span={16}>
          <RevenueOverTime data={props.data} />
        </Col>
      </Row>
    </div>
  );
}

function ProductTable(props: {data: Map<string, TableRow>}) {
  const columns: ColumnsType<TableRow> = [
    {
      title: 'Produkt',
      dataIndex: 'product',
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
    <Table<TableRow>
      bordered
      pagination={false}
      size="small"
      columns={columns}
      dataSource={Array.from(props.data.values()).sort(
        (a, b) => b.revenue - a.revenue,
      )}
      rowKey="product"
    />
  );
}

function ProductPieChart(props: {data: Map<string, TableRow>}) {
  const data = Array.from(props.data.values()).map((v) => ({
    type: v.product,
    value: v.amount,
  }));
  return (
    <Card title="Anzahl" size="small">
      <Suspense fallback={null}>
        <Pie
          forceFit
          radius={0.8}
          data={data}
          angleField="value"
          colorField="type"
        />
      </Suspense>
    </Card>
  );
}

function RevenueOverTime(props: {data: TransactionData[]}) {
  const grouping = 3600000;
  const hours = props.data.reduce((acc, transaction) => {
    const hour = Math.round(
      new Date(transaction.deviceTime).getTime() / grouping,
    );
    return acc.set(
      hour,
      (acc.get(hour) ?? 0) + revenueFromTransaction(transaction) / 100,
    );
  }, new Map<number, number>());

  const min = Math.min(...Array.from(hours.keys()));
  const max = Math.max(...Array.from(hours.keys()));

  const data = [];
  for (let i = min; i <= max; i++) {
    const revenue = hours.get(i) ?? 0;
    data.push({
      hour: moment((min + i) * grouping).format('dd HH:00'),
      revenue,
      type: 's',
    });
  }
  return (
    <Card title="Umsatz" size="small">
      <Suspense fallback={null}>
        <Area
          forceFit
          data={data}
          xField="hour"
          yField="revenue"
          // stackField="type"
        />
      </Suspense>
    </Card>
  );
}
