import {TransactionData} from './useData';
import {Table, Row, Col, Card, Statistic} from 'antd';
import currencyFormatter from '../utils/currencyFormatter';
import {ColumnsType} from 'antd/lib/table';
import {revenueFromTransaction} from '../utils/transaction';
import {ArrowUpOutlined} from '@ant-design/icons';
import {useEffect, Suspense} from 'react';
import React from 'react';
const Pie = React.lazy(() =>
  import('@ant-design/charts').then((module) => ({default: module.Pie})),
);
const Area = React.lazy(() =>
  import('@ant-design/charts').then((module) => ({default: module.Area})),
);

type TableRow = {
  product: string;
  amount: number;
  revenue: number;
};

export default function TransactionStats(props: {data: TransactionData[]}) {
  const GUTTER: [number, number] = [16, 16];
  const data = props.data.reduce((acc, transaction) => {
    transaction.cartItems.forEach((line) =>
      acc.set(line.product, {
        product: line.product,
        amount: (acc.get(line.product)?.amount ?? 0) + line.amount,
        revenue:
          (acc.get(line.product)?.revenue ?? 0) + line.price * line.amount,
      }),
    );
    return acc;
  }, new Map<string, TableRow>());

  return (
    <div>
      <Row gutter={GUTTER}>
        <Col>
          <Statistic
            title="Umsatz"
            value={11.28}
            precision={2}
            valueStyle={{color: '#3f8600'}}
            prefix={<ArrowUpOutlined />}
            suffix="%"
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
        <Col span={8}>
          <RevenuePerListTable data={props.data} />
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
    },

    {
      title: 'Umsatz',
      dataIndex: 'revenue',
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
      footer={() => <span>Summe</span>}
    />
  );
}

function ProductPieChart(props: {data: Map<string, TableRow>}) {
  console.log(Pie);
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

function RevenuePerListTable(props: {data: TransactionData[]}) {
  const data = props.data.reduce((acc, transaction) => {
    const listName = transaction.listName || '(unbekannt)';
    return acc.set(
      listName,
      acc.get(listName) ?? 0 + revenueFromTransaction(transaction),
    );
  }, new Map<string, number>());

  return (
    <Table
      bordered
      pagination={false}
      size="small"
      columns={[
        {
          title: 'Preisliste',
          dataIndex: 'list',
        },
        {
          title: 'Umsatz',
          dataIndex: 'revenue',
          render: (p) => currencyFormatter.format(p / 100),
        },
      ]}
      dataSource={Array.from(data.entries())
        .map(([list, revenue]) => ({
          list,
          revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)}
      rowKey="list"
    />
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
      acc.get(hour) ?? 0 + revenueFromTransaction(transaction) / 100,
    );
  }, new Map<number, number>());
  const min = Math.min(...Array.from(hours.keys()));
  const max = Math.max(...Array.from(hours.keys()));

  const data = [];
  for (let i = min; i <= max; i++) {
    const revenue = hours.get(i) ?? 0;
    data.push({
      name: new Date(i * grouping),
      revenue,
    });
  }
  return (
    <Card title="Umsatz" size="small">
      <Suspense fallback={null}>
        <Area
          data={data}
          xField="Date"
          yField="scales"
          xAxis={{
            type: 'dateTime',
            tickCount: 5,
          }}
        />
      </Suspense>
    </Card>
  );
}
