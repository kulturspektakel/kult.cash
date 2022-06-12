import {GetServerSideProps} from 'next';
import Card from '../../components/Card';
import request, {gql} from 'graphql-request';

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  try {
    const data = await request(
      'https://api.kulturspektakel.de/graphql',
      gql`
        query CardStatus($payload: String!) {
          cardStatus(payload: $payload) {
            balance
            deposit
            cardId
            recentTransactions {
              balanceAfter
              balanceBefore
              ... on MissingTransaction {
                numberOfMissingTransactions
              }
              ... on CardTransaction {
                Order {
                  items {
                    productList {
                      emoji
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        payload: String(context.query.payload),
      },
    );

    return {props: data.cardStatus};
  } catch (e) {}

  context.res.statusCode = 404;
  context.res.end();
};

type Props = {
  balance: number;
  deposit: number;
};

export default function Balance(props: Props) {
  return <Card {...props} />;
}
