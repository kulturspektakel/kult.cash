import {GetServerSideProps} from 'next';
import {getServerSideProps as gSSP} from '../../$$/[payload]';
import Page from '../../../components/Page';
import {CardStatusQuery} from '../../../graphql/generated';

export const getServerSideProps: GetServerSideProps<CardStatusQuery> = gSSP;

export default function Classic(props: CardStatusQuery) {
  return <Page {...props} />;
}
