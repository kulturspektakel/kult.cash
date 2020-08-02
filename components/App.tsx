import {Layout, Menu} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
const {Header, Content} = Layout;
import styles from './App.module.css';
import Login from './Login';
import {SWRConfig} from 'swr';
import fetch from 'unfetch';

const fetcher = async (key: string) => {
  console.log('key', key);
  const r = await fetch(key);
  return await r.json();
};

const ROUTES = {
  '/dashboard': 'Geräte',
  '/dashboard/lists': 'Preislisten',
  '/dashboard/transactions': 'Buden',
  '/dashboard/transactions?bonbude=1': 'Bonbuden',
};

export default function App({
  children,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const router = useRouter();

  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 3000,
      }}
    >
      <Layout className={styles.root}>
        <Login />
        <Header>
          <div className={styles.logo}>kult.ca$h</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[router.route]}
          >
            {Object.entries(ROUTES).map(([route, title]) => (
              <Menu.Item key={route}>
                <Link href={route}>
                  <a href={route}>{title}</a>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </SWRConfig>
  );
}
