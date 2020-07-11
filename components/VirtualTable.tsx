import React, {useState, useRef, useEffect} from 'react';
import {VariableSizeGrid, GridChildComponentProps} from 'react-window';
import {Table} from 'antd';
import styles from './VirtualTable.module.css';
import ReactResizeDetector from 'react-resize-detector';
import {TableProps, ColumnType, ColumnsType} from 'antd/lib/table';
import memoize from 'lodash.memoize';

type ColumnsTypeWithWidth<RecordType> = Array<
  ColumnType<RecordType> & {
    width: number;
  }
>;

const getMergedColumns = memoize(
  <RecordType extends object>(
    columns: Array<ColumnType<RecordType>>,
    tableWidth: number,
  ): ColumnsTypeWithWidth<RecordType> => {
    const columnsWithFixedWidth = columns.reduce(
      (acc, cv) => acc + (typeof cv.width === 'number' ? cv.width : 0),
      0,
    );
    tableWidth -= columnsWithFixedWidth;

    return columns.map((column) => {
      let width = 0;
      if (typeof column.width === 'string' && column.width.endsWith('%')) {
        width = (tableWidth * parseInt(column.width, 10)) / 100;
      } else {
        width = column.width as number;
      }
      return {...column, width};
    });
  },
  // memoize multiple arguments
  (...args) => JSON.stringify(args),
);

const ROW_HEIGHT = 40;

export default function VirtualTable<RecordType extends object>(
  props: TableProps<RecordType> & {
    columns: ColumnsType<RecordType>;
  },
) {
  const {columns} = props;
  const [size, setSize] = useState<{width: number; height: number}>({
    width: 0,
    height: 0,
  });
  const gridRef = useRef<VariableSizeGrid>(null);
  const mergedColumns = getMergedColumns(columns, size.width);
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: false,
      });
    }
  }, [size]);

  let columnCount = mergedColumns.length;
  if (props.rowSelection) {
    columnCount++;
  }
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={(width, height) =>
        // prevent rounding errors
        setSize({width: Math.floor(width), height: Math.floor(height)})
      }
    >
      {size.height > 0 && (
        <Table
          {...props}
          scroll={{y: size.height, x: size.width}}
          className="virtual-table"
          columns={mergedColumns}
          pagination={false}
          components={{
            body: (rawData) => (
              <VariableSizeGrid
                ref={gridRef}
                className="virtual-grid"
                columnCount={columnCount}
                columnWidth={(index) => mergedColumns[index].width}
                height={size.height - ROW_HEIGHT}
                rowCount={rawData.length}
                rowHeight={() => ROW_HEIGHT}
                width={size.width - 1}
              >
                {Cell(mergedColumns, rawData)}
              </VariableSizeGrid>
            ),
          }}
        />
      )}
    </ReactResizeDetector>
  );
}

const Cell = <RecordType extends object>(
  mergedColumns: Array<ColumnType<RecordType>>,
  rawData: RecordType[],
) => ({columnIndex, rowIndex, style}: GridChildComponentProps) => {
  const col = mergedColumns[columnIndex];
  // @ts-ignore
  const value = rawData[rowIndex][col.dataIndex];
  return (
    <div className={styles.cell} style={style}>
      {col.render ? col.render!(value, rawData[rowIndex], rowIndex) : value}
    </div>
  );
};
