import Card, {CardFragment} from './Card';
import {gql} from 'graphql-request';
import {CardStatusQuery} from '../graphql/generated';
import styles from './Page.module.css';
import Head from 'next/head';
import CardTransactionComponent, {
  CardTransactionFragment,
} from './CardTransactionComponent';

export const PageQuery = gql`
  query CardStatus($payload: String!) {
    cardStatus(payload: $payload) {
      ...CardFragment
      cardId
      recentTransactions {
        ...CardTransactionFragment
      }
    }
  }
  ${CardFragment}
  ${CardTransactionFragment}
`;

export default function Page(props: CardStatusQuery) {
  return (
    <div className={styles.root}>
      <Head>
        <title>KultCard Guthaben</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <h1 className={styles.heading}>KultCard</h1>
      <Card {...props.cardStatus} />
      <div className={styles.info}>
        Das Guthaben der Karte kann an den Bonbuden ausgezahlt werden. Auf der
        Karte selbst sind 2&nbsp;Euro Kartenpfand.
      </div>
      {props.cardStatus.recentTransactions &&
        props.cardStatus.recentTransactions?.length > 0 && (
          <>
            <h2 className={styles.heading}>Letzte Buchungen</h2>
            <ol className={styles.recentTransactions}>
              {props.cardStatus.recentTransactions.map((t, i) => (
                <CardTransactionComponent key={i} {...t} />
              ))}
            </ol>
            <div className={styles.info}>
              Es kann einige Zeit dauern, bis alle Buchungen vollständig in der
              Liste dargestellt werden. Das angezeigte Guthaben auf der Karte
              ist jedoch immer aktuell.
            </div>
          </>
        )}
    </div>
  );
}
