import {GetServerSideProps} from 'next';
import request from 'graphql-request';
import {
  CardStatusQuery,
  CardStatusQueryVariables,
} from '../../graphql/generated';
import Page, {PageQuery} from '../../components/Page';

export const getServerSideProps: GetServerSideProps<CardStatusQuery> = async (
  context,
) => {
  if (!Array.isArray(context.query.payload)) {
    return {
      notFound: true,
    };
  }

  const [dollar, ...payload] = context.query.payload;
  if (dollar !== '$$' && dollar !== '$$$') {
    return {
      notFound: true,
    };
  }

  try {
    const data = await request<CardStatusQuery, CardStatusQueryVariables>(
      'https://api.kulturspektakel.de/graphql',
      PageQuery,
      {
        payload: payload.join('/'),
      },
    );

    return {props: data};
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

export default function Ultralight(props: CardStatusQuery) {
  return <Page {...props} />;
}
