import Card, {CardFragment} from './Card';
import {gql} from 'graphql-request';
import {CardStatusQuery} from '../graphql/generated';
import styles from './Page.module.css';
import Head from 'next/head';
import {useLongPress} from 'use-long-press';
import CardTransactionComponent, {
  CardTransactionFragment,
} from './CardTransactionComponent';

export const PageQuery = gql`
  query CardStatus($payload: String!) {
    cardStatus(payload: $payload) {
      ...CardFragment
      cardId
      hasNewerTransactions
      recentTransactions {
        ...CardTransactionFragment
      }
    }
  }
  ${CardFragment}
  ${CardTransactionFragment}
`;

export default function Page(props: CardStatusQuery) {
  const longPress = useLongPress(() => {
    window.open(
      `https://crew.kulturspektakel.de/products/card?id=${props.cardStatus.cardId}`,
    );
  });
  return (
    <div className={styles.root}>
      <Head>
        <title>KultCard Guthaben</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <h1 className={styles.heading}>KultCard</h1>
      <div {...longPress()}>
        <Card {...props.cardStatus} />
      </div>
      <div className={styles.info}>
        Das Guthaben der Karte kann an den Bonbuden ausgezahlt werden. Auf der
        Karte selbst sind 2&nbsp;Euro Kartenpfand.
      </div>
      {props.cardStatus.recentTransactions &&
        props.cardStatus.recentTransactions?.length > 0 && (
          <>
            <h2 className={styles.heading}>Letzte Buchungen</h2>
            {props.cardStatus.hasNewerTransactions && (
              <div className={styles.hasNewerTransactions}>
                <svg version="1.1" viewBox="0 0 30 30">
                  <circle cx="26" cy="24" r="2" />
                  <path d="M17,5c0,1.105-0.895,1-2,1s-2,0.105-2-1s0.895-2,2-2S17,3.895,17,5z" />
                  <circle cx="4" cy="24" r="2" />
                  <path d="M16.836,4.21L15,4l-1.836,0.21L2.3,22.948L4.144,26H15h10.856l1.844-3.052L16.836,4.21z M16.212,11.36l-0.2,6.473h-2.024  l-0.2-6.473H16.212z M15.003,22.189c-0.828,0-1.323-0.441-1.323-1.182c0-0.755,0.494-1.196,1.323-1.196  c0.822,0,1.316,0.441,1.316,1.196C16.319,21.748,15.825,22.189,15.003,22.189z" />
                </svg>
                <p>
                  Es liegen neuere Buchungen vor. Karte erneut auslesen um diese
                  anzuzeigen.
                </p>
              </div>
            )}
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
