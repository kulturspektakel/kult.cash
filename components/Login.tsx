import Modal from 'antd/lib/modal/Modal';
import styles from './Login.module.css';
import {atom, useRecoilState} from 'recoil';
import Spin from 'antd/lib/spin';

export const requiresLoginAtom = atom<boolean>({
  key: 'loginState',
  default: false,
});

export default function Login() {
  const [requiresLogin] = useRecoilState(requiresLoginAtom);

  const redirectURI =
    typeof window !== 'undefined'
      ? window.location.origin + '/api/dashboard/login'
      : '';

  const isVisible = typeof window !== 'undefined' && requiresLogin;

  return (
    <Modal visible={isVisible} centered={true} closable={false} footer={null}>
      <div className={styles.root}>
        {typeof window !== 'undefined' &&
        window.location.search.startsWith('?code') ? (
          <Spin />
        ) : (
          <a
            href={`https://slack.com/oauth/authorize?&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=channels:history,reactions:write,chat:write:user,users:read&redirect_uri=${redirectURI}`}
            className="loginButton"
          >
            <img
              alt="Login with Slack"
              height="40"
              width="172"
              src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
              srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
            />
          </a>
        )}
      </div>
    </Modal>
  );
}
