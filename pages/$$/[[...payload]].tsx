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
  try {
    const data = await request<CardStatusQuery, CardStatusQueryVariables>(
      'https://api.kulturspektakel.de/graphql',
      PageQuery,
      {
        payload: Array.isArray(context.query.payload)
          ? context.query.payload.join('/')
          : context.query.payload ?? '',
      },
    );

    return {props: data};
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default function Ultralight(props: CardStatusQuery) {
  return <Page {...props} />;
}
