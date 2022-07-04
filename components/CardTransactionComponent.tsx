import {gql} from 'graphql-request';
import {CardTransactionFragmentFragment} from '../graphql/generated';
import {currencyFormatter} from './Card';
import styles from './CardTransaction.module.css';

export const CardTransactionFragment = gql`
  fragment CardTransactionFragment on Transaction {
    depositBefore
    depositAfter
    balanceBefore
    balanceAfter
    __typename

    ... on CardTransaction {
      deviceTime
      Order {
        items {
          amount
          name
          productList {
            emoji
            name
          }
        }
      }
    }
    ... on MissingTransaction {
      numberOfMissingTransactions
    }
  }
`;

export default function CardTransactionComponent(
  props: CardTransactionFragmentFragment,
) {
  const total = props.balanceBefore - props.balanceAfter;
  const isTopUp = props.balanceAfter > props.balanceBefore;

  let title: string = isTopUp ? 'Gutschrift' : 'Abbuchung';
  if (total === 0) {
    title = 'Unbekannte Buchung';
  }
  let subtitle: string | undefined = undefined;
  let subtitle2: React.ReactElement | undefined = undefined;
  let emoji: string | undefined = isTopUp ? '💰' : undefined;

  if (props.__typename === 'CardTransaction') {
    const order = props.Order.find(() => true);
    const productList = order?.items.find(() => true)?.productList;
    if (productList?.emoji) {
      emoji = productList.emoji;
    }
    if (productList?.name) {
      title = productList?.name;
    }
    const d = new Date(props.deviceTime);

    // Safari adds commas which breaks SSR
    subtitle2 = (
      <>
        {d
          .toLocaleDateString('de-DE', {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            timeZone: 'Europe/Berlin',
          })
          .replace(',', '')}
        ,&nbsp;
        {d.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Berlin',
        })}
        &nbsp;Uhr
      </>
    );

    const p = order?.items.map((i) => `${i.amount}× ${i.name}`) ?? [];
    const deposit = props.depositAfter - props.depositBefore;
    if (deposit > 0) {
      p.push(`${deposit}× Pfand`);
    } else if (deposit < 0) {
      p.push(`${deposit * -1}× Pfandrückgabe`);
    }
    subtitle = p.join(', ');
  } else if (props.__typename === 'MissingTransaction') {
    if (props.numberOfMissingTransactions === 1) {
      subtitle = 'Details noch nicht verfügbar';
    } else {
      subtitle = `Details von ${props.numberOfMissingTransactions} Buchungen noch nicht verfügbar`;
      emoji = undefined;
    }
  }

  return (
    <li className={styles.root}>
      <div className={styles.emoji}>{emoji}</div>
      <div className={styles.content}>
        <h3>{title}</h3>
        {subtitle && (
          <div
            className={`${styles.subtitle} ${
              props.__typename === 'CardTransaction' ? styles.singleLine : ''
            }`}
          >
            {subtitle}
          </div>
        )}
        {subtitle2 && <div className={styles.subtitle}>{subtitle2}</div>}
      </div>
      {total !== 0 && (
        <div className={styles.accessory}>
          {total < 0 ? '+' : ''}
          {currencyFormatter.format(Math.abs(total) / 100)}
        </div>
      )}
    </li>
  );
}
