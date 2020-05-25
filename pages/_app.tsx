import 'antd/dist/antd.css';
import 'emoji-mart/css/emoji-mart.css';
import {AppProps} from 'next/app';
import moment from 'moment';
import {RecoilRoot} from 'recoil';

moment.locale('de');
function MyApp({Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
