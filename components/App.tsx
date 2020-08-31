import {Layout, Menu} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
const {Header, Content} = Layout;
import styles from './App.module.css';
import Login from './Login';

const ROUTES = {
  '/dashboard': 'Geräte',
  '/dashboard/lists': 'Preislisten',
  '/dashboard/transactions/virtual': 'Buden',
  '/dashboard/transactions/real': 'Bonbuden',
  '/dashboard/cards': 'Karten',
};

export default function App({
  children,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const router = useRouter();

  return (
    <Layout className={styles.root}>
      <Login />
      <Header>
        <div className={styles.logo}>kult.ca$h</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[router.asPath]}
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
  );
}
