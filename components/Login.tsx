import Modal from 'antd/lib/modal/Modal';
import styles from './Login.module.css';
import {useSession, signin} from 'next-auth/client';

export default function Login() {
  const [session, loading] = useSession();
  const isVisible = typeof window !== 'undefined' && !session && !loading;

  return (
    <Modal visible={isVisible} centered={true} closable={false} footer={null}>
      <div className={styles.root}>
        <a onClick={() => signin('slack' as any, {})} className="loginButton">
          <img
            alt="Login with Slack"
            height="40"
            width="172"
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
          />
        </a>
      </div>
    </Modal>
  );
}
