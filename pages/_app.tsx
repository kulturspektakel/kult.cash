import 'antd/dist/antd.css';
import 'emoji-mart/css/emoji-mart.css';
import {AppProps} from 'next/app';
import moment from 'moment';
import {Provider} from 'next-auth/client';

moment.locale('de');
function MyApp({Component, pageProps}: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
