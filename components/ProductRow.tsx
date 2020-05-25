import styles from './ProductRow.module.css';
import {Input} from 'antd';
import React, {useRef} from 'react';
import {ProductT} from './ProductList';

type Props = {
  index: number;
  product: string | null;
  price: number | null;
  onChange: (i: number, newProduct: Partial<ProductT>) => void;
};
type Ref = HTMLLIElement;

const formatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default React.forwardRef<Ref, Props>(
  ({product, price, index, onChange, ...props}: Props, ref) => {
    const inputRef = useRef<Input>();
    return (
      <li className={styles.root} ref={ref} {...props}>
        <span className={styles.index}>{index}</span>
        <Input
          value={product}
          maxLength={16}
          onChange={(e) => {
            onChange(index - 1, {name: e.target.value});
          }}
        />
        &nbsp;
        <Input
          ref={inputRef}
          inputMode="decimal"
          defaultValue={formatter.format(price / 100)}
          onBlur={(e) => {
            let newPrice = Math.floor(
              parseFloat((e.target.value || '0').replace(/,/g, '.')) * 100,
            );
            if (newPrice > 9999) {
              newPrice = 9999;
            }
            if (newPrice === price) {
              return;
            }
            onChange(index - 1, {price: newPrice});
          }}
          style={{width: '115px'}}
          min={0}
          max={9999}
          suffix="€"
        />
      </li>
    );
  },
);
