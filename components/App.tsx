import {Layout, Menu} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
const {Header, Content} = Layout;
import styles from './App.module.css';
import Login from './Login';

export enum Route {
  Home = '/dashboard',
  Lists = '/dashboard/lists',
  Virtual = '/dashboard/transactions/virtual',
  Real = '/dashboard/transactions/real',
  Cards = '/dashboard/cards',
}

const titles: Record<Route, string> = {
  [Route.Home]: 'Geräte',
  [Route.Lists]: 'Preislisten',
  [Route.Virtual]: 'Buden',
  [Route.Real]: 'Bonbuden',
  [Route.Cards]: 'Karten',
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
          {Object.values(Route).map((route) => (
            <Menu.Item key={route}>
              <Link href={route}>
                <a href={route}>{titles[route]}</a>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content className={styles.content}>{children}</Content>
    </Layout>
  );
}
