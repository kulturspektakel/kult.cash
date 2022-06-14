import {useEffect, useState} from 'react';
import styles from './Card.module.css';
import {gql} from 'graphql-request';
import {CardFragmentFragment} from '../graphql/generated';

export const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

export const CardFragment = gql`
  fragment CardFragment on CardStatus {
    balance
    deposit
  }
`;

export default function Balance({balance, deposit}: CardFragmentFragment) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 200);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${mounted ? styles.activeCard : ''}`}>
        <svg viewBox="0 0 242.65 153.01">
          <defs>
            <clipPath id="a">
              <rect width="242.65" height="153.01" rx="8.57" fill="none" />
            </clipPath>
            <linearGradient
              id="b"
              x1="5.2"
              y1="124.01"
              x2="244.55"
              y2="64.32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#e41339" />
              <stop offset="1" stopColor="#e94b3e" />
            </linearGradient>
            <linearGradient
              id="c"
              x1="194.63"
              y1="40.56"
              x2="275.76"
              y2="40.56"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.01" stopColor="#f4992c" />
              <stop offset="1" stopColor="#ed6e18" />
            </linearGradient>
          </defs>
          <g clipPath="url(#a)">
            <rect y="0" width="242.65" height="153.01" fill="url(#b)" />
            <circle
              cx="211.1"
              cy="128.72"
              r="64.66"
              fill="#eb724c"
              opacity="0.5"
            />
            <circle
              cx="235.2"
              cy="40.56"
              r="40.56"
              opacity="0.4"
              fill="url(#c)"
            />
            <path
              d="M224.76,86.3a1,1,0,0,1-.47-.13.94.94,0,0,1-.34-1.29,14.84,14.84,0,0,0,0-14.76.94.94,0,1,1,1.63-.94,16.7,16.7,0,0,1,0,16.64A.94.94,0,0,1,224.76,86.3Zm-3.45-1.73a.88.88,0,0,1-.47-.13.94.94,0,0,1-.35-1.29,11.34,11.34,0,0,0,0-11.3.94.94,0,0,1,1.63-.95,13.24,13.24,0,0,1,0,13.2A.94.94,0,0,1,221.31,84.57ZM218,82.86a.9.9,0,0,1-.47-.13.94.94,0,0,1-.35-1.28,8.13,8.13,0,0,0,0-8,.95.95,0,1,1,1.64-.94,10,10,0,0,1,0,9.89A1,1,0,0,1,218,82.86Zm-3.3-1.59a.91.91,0,0,1-.52-.16,1,1,0,0,1-.27-1.3,4.14,4.14,0,0,0,0-4.62.95.95,0,0,1,1.58-1,6.09,6.09,0,0,1,0,6.7A1,1,0,0,1,214.71,81.27Z"
              fill="#fff"
            />
            <g>
              <path
                d="M11.23,11.17v25h25v-25ZM30.71,31H25.56l-4.19-4.89V31H17.22V16.34h4.15v4.83l3.86-4.83h5v.25l-6,7,6.47,7.24V31Z"
                fill="#fff"
              />
              <g>
                <g>
                  <path
                    d="M46.44,11.24l-3.67,4.12,4,4.35v.09H44.81L41.36,16V19.8H39.81V11.17h1.55v3.65l3.14-3.65h1.94v.07Z"
                    fill="#fff"
                  />
                  <path
                    d="M54.38,11.19v5c0,2.56-1.49,3.86-3.56,3.86a3.53,3.53,0,0,1-3.67-3.86V11.21h1.53v4.94c0,1.56.85,2.37,2.14,2.37s2-.9,2-2.37V11.21h1.54v0Z"
                    fill="#fff"
                  />
                  <path
                    d="M57.47,11.19v7.12h4.25V19.8H55.94V11.17h1.53Z"
                    fill="#fff"
                  />
                  <path
                    d="M63.7,12.66H61.1V11.19h6.79v1.47H65.28V19.8H63.73l0-7.14Z"
                    fill="#fff"
                  />
                  <path
                    d="M76.3,11.19v5c0,2.56-1.49,3.86-3.56,3.86a3.53,3.53,0,0,1-3.68-3.86V11.21H70.6v4.94c0,1.56.85,2.37,2.14,2.37s2-.9,2-2.37V11.21h1.53v0Z"
                    fill="#fff"
                  />
                  <path
                    d="M85.13,19.82H83.29l-2.41-2.88H79.39v2.88H77.83V11.19l3.92,0a2.81,2.81,0,0,1,3,2.87,2.52,2.52,0,0,1-2.09,2.7l2.49,2.95,0,.09ZM79.39,12.7v2.77h2.36a1.37,1.37,0,1,0,0-2.74l-2.36,0Z"
                    fill="#fff"
                  />
                </g>
                <g>
                  <path
                    d="M43.5,22.52a1.58,1.58,0,0,0-1.29-.62c-.76,0-1.13.32-1.13.76s.55.63,1.22.73c1.13.14,2.2.46,2.2,1.83s-1.07,1.84-2.29,1.84a2.22,2.22,0,0,1-2.38-1.42l.87-.46a1.54,1.54,0,0,0,1.53.91c.65,0,1.27-.24,1.27-.87s-.53-.76-1.27-.83c-1.11-.14-2.13-.44-2.13-1.75S41.21,21,42.21,21a2.15,2.15,0,0,1,2.14,1.14Z"
                    fill="#fff"
                  />
                  <path
                    d="M47.88,25.18H46.32v1.67h-1V21.13h2.58A2,2,0,0,1,47.88,25.18Zm-1.56-1h1.56a1,1,0,0,0,0-2H46.32Z"
                    fill="#fff"
                  />
                  <path
                    d="M54.67,26.85H50.58V21.13h4.09v1H51.6V23.5h3v1h-3v1.3h3.07Z"
                    fill="#fff"
                  />
                  <path
                    d="M59.85,21.17l-2.42,2.75,2.62,2.89v.07H58.78l-2.29-2.54v2.51h-1V21.13h1v2.42l2.09-2.42h1.29v0Z"
                    fill="#fff"
                  />
                  <path
                    d="M62,22.11H60.26v-1h4.49v1H63v4.74H62V22.11Z"
                    fill="#fff"
                  />
                  <path
                    d="M69.27,25.78H66.4l-.47,1.07H64.82l2.44-5.72H68.4l2.45,5.72H69.71Zm-1.43-3.44-1,2.44h2Z"
                    fill="#fff"
                  />
                  <path
                    d="M75.65,21.17l-2.42,2.75,2.62,2.89v.07H74.58l-2.29-2.54v2.51h-1V21.13h1v2.42l2.09-2.42h1.29l0,0Z"
                    fill="#fff"
                  />
                  <path
                    d="M80.46,26.85H76.37V21.13h4.09v1H77.39V23.5h3v1h-3v1.3h3.07Z"
                    fill="#fff"
                  />
                  <path d="M82.28,21.13v4.72h2.83v1H81.26V21.13Z" fill="#fff" />
                </g>
                <g>
                  <path
                    d="M46.15,29.69a3.42,3.42,0,0,0-2.43-1,3.24,3.24,0,0,0-3.31,3.49,3.19,3.19,0,0,0,3.31,3.44,3.3,3.3,0,0,0,2.3-.91V32.48H43.39V32h3.16v3A3.83,3.83,0,0,1,43.7,36.2a3.72,3.72,0,0,1-3.87-4,3.76,3.76,0,0,1,3.87-4.07,3.85,3.85,0,0,1,2.76,1.19Z"
                    fill="#fff"
                  />
                  <path
                    d="M54.11,36.09l-.82-1.93H48.8L48,36.09h-.62l3.36-7.86h.63l3.36,7.86ZM53,33.6l-2-4.79L49,33.6Z"
                    fill="#fff"
                  />
                  <path
                    d="M60.88,28.22v4.89a2.89,2.89,0,1,1-5.76,0V28.22h.57v4.89a2.32,2.32,0,1,0,4.63,0V28.22Z"
                    fill="#fff"
                  />
                  <path
                    d="M64.59,28.78H61.88v-.53h6v.53H65.17v7.31H64.6V28.78Z"
                    fill="#fff"
                  />
                  <path d="M69,36.09V28.22h.58v7.87Z" fill="#fff" />
                  <path
                    d="M71.49,28.22l5.05,6.5v-6.5h.58v7.87H76.9L71.82,29.6v6.49h-.58V28.22Z"
                    fill="#fff"
                  />
                  <path
                    d="M84.71,29.69a3.42,3.42,0,0,0-2.43-1A3.24,3.24,0,0,0,79,32.16a3.19,3.19,0,0,0,3.31,3.44,3.3,3.3,0,0,0,2.3-.91V32.48H82V32h3.16v3a3.83,3.83,0,0,1-2.85,1.27,3.72,3.72,0,0,1-3.87-4,3.76,3.76,0,0,1,3.87-4.07A3.85,3.85,0,0,1,85,29.32Z"
                    fill="#fff"
                  />
                </g>
              </g>
            </g>
            <text transform="translate(86.09 140)" fontSize="16" fill="#fff">
              {deposit}
            </text>
            <text transform="translate(13.36 140)" fontSize="16" fill="#fff">
              {currencyFormatter.format(balance / 100)}
            </text>
            <g>
              <path
                d="M18.87,121.93a4.21,4.21,0,0,1-1.21.17,3.93,3.93,0,0,1-1.41-.24,3,3,0,0,1-1.07-.68,2.91,2.91,0,0,1-.69-1.05,3.58,3.58,0,0,1-.24-1.33,3.8,3.8,0,0,1,.23-1.34,3,3,0,0,1,.67-1,2.87,2.87,0,0,1,1-.67,3.75,3.75,0,0,1,1.37-.24,4,4,0,0,1,.72.06,3.62,3.62,0,0,1,.61.16,2.81,2.81,0,0,1,.52.26,3,3,0,0,1,.45.34l-.26.42a.3.3,0,0,1-.17.13.31.31,0,0,1-.22-.05l-.26-.16a1.69,1.69,0,0,0-.33-.16,2.5,2.5,0,0,0-.46-.14,3,3,0,0,0-.63,0,2.5,2.5,0,0,0-1,.17,2.07,2.07,0,0,0-.73.5,2.16,2.16,0,0,0-.47.79,3,3,0,0,0-.16,1,3,3,0,0,0,.17,1.07,2.06,2.06,0,0,0,.48.8,2.25,2.25,0,0,0,.77.51,3,3,0,0,0,1,.17l.41,0,.37-.08.33-.11.33-.15v-1.38h-1a.25.25,0,0,1-.15,0,.17.17,0,0,1-.05-.13v-.53h2v2.5A3.79,3.79,0,0,1,18.87,121.93Z"
                fill="#fff"
              />
              <path
                d="M24.08,121.29a1.71,1.71,0,0,0,.7-.14,1.3,1.3,0,0,0,.52-.37,1.47,1.47,0,0,0,.33-.57,2.11,2.11,0,0,0,.11-.73v-3.91h.93v3.91a3,3,0,0,1-.18,1,2.51,2.51,0,0,1-.51.83,2.37,2.37,0,0,1-.82.55,3,3,0,0,1-2.16,0,2.33,2.33,0,0,1-.81-.55,2.38,2.38,0,0,1-.52-.83,3,3,0,0,1-.18-1v-3.91h.93v3.91a2.38,2.38,0,0,0,.11.73,1.61,1.61,0,0,0,.33.57,1.3,1.3,0,0,0,.52.37A1.75,1.75,0,0,0,24.08,121.29Z"
                fill="#fff"
              />
              <path
                d="M33,115.57v.78H30.89V122H30v-5.68H27.89v-.78Z"
                fill="#fff"
              />
              <path
                d="M39.52,122h-.93v-2.92H35.18V122h-.93v-6.46h.93v2.86h3.41v-2.86h.93Z"
                fill="#fff"
              />
              <path
                d="M46.8,122h-.72a.32.32,0,0,1-.2-.06.48.48,0,0,1-.12-.16l-.58-1.52H42.32l-.58,1.52a.33.33,0,0,1-.11.15.31.31,0,0,1-.2.07h-.72l2.57-6.46h.94Zm-4.23-2.4h2.36l-1-2.55a2.91,2.91,0,0,1-.1-.28,2.47,2.47,0,0,1-.1-.35l-.1.35c0,.11-.07.21-.1.29Z"
                fill="#fff"
              />
              <path
                d="M48,122v-6.46h2.09a3.89,3.89,0,0,1,1,.12,2.13,2.13,0,0,1,.71.33,1.34,1.34,0,0,1,.41.54,1.75,1.75,0,0,1,.14.7,1.44,1.44,0,0,1-.08.46,1.31,1.31,0,0,1-.22.4,1.72,1.72,0,0,1-.37.34,2,2,0,0,1-.53.24,2,2,0,0,1,1.05.51,1.34,1.34,0,0,1,.36,1,1.79,1.79,0,0,1-.15.75,1.61,1.61,0,0,1-.45.59,2.08,2.08,0,0,1-.71.37,3.24,3.24,0,0,1-1,.14Zm.92-3.58H50a2.35,2.35,0,0,0,.63-.08,1.29,1.29,0,0,0,.44-.21,1.06,1.06,0,0,0,.26-.34,1,1,0,0,0,.08-.44,1,1,0,0,0-.33-.82,1.72,1.72,0,0,0-1-.26H48.9Zm0,.65v2.19h1.37a2.25,2.25,0,0,0,.63-.08,1.18,1.18,0,0,0,.43-.24,1,1,0,0,0,.25-.36,1.33,1.33,0,0,0,.07-.45.93.93,0,0,0-.34-.77,1.59,1.59,0,0,0-1-.29Z"
                fill="#fff"
              />
              <path
                d="M58.17,115.57v.76H55.11v2.08h2.47v.73H55.11v2.13h3.06V122h-4v-6.46Z"
                fill="#fff"
              />
              <path
                d="M60.39,115.6a.4.4,0,0,1,.14.13l3.67,4.77c0-.09,0-.17,0-.25a1.7,1.7,0,0,1,0-.22v-4.46H65V122h-.47a.34.34,0,0,1-.18,0,.44.44,0,0,1-.15-.13l-3.68-4.76c0,.08,0,.15,0,.23V122h-.81v-6.46h.48A.42.42,0,0,1,60.39,115.6Z"
                fill="#fff"
              />
            </g>
            <g>
              <path
                d="M87.49,119.64V122h-.92v-6.46h1.94a3.46,3.46,0,0,1,1.07.15,2,2,0,0,1,.75.4,1.69,1.69,0,0,1,.45.64,2.14,2.14,0,0,1,.15.82,2,2,0,0,1-.16.83,1.75,1.75,0,0,1-.46.65,2,2,0,0,1-.76.43,3.3,3.3,0,0,1-1,.15Zm0-.74h1a1.83,1.83,0,0,0,.64-.1,1.25,1.25,0,0,0,.47-.26,1.22,1.22,0,0,0,.29-.42,1.53,1.53,0,0,0,.09-.54,1.44,1.44,0,0,0-.09-.53,1,1,0,0,0-.28-.41,1.24,1.24,0,0,0-.47-.25,2.08,2.08,0,0,0-.65-.09h-1Z"
                fill="#fff"
              />
              <path
                d="M96.35,115.57v.76H93.29v2.19H95.9v.76H93.29V122h-.93v-6.46Z"
                fill="#fff"
              />
              <path
                d="M102.41,122h-.72a.32.32,0,0,1-.2-.06.48.48,0,0,1-.12-.16l-.58-1.52H97.92l-.58,1.52a.23.23,0,0,1-.11.15.27.27,0,0,1-.2.07h-.72l2.58-6.46h.94Zm-4.23-2.4h2.35l-1-2.55a1.51,1.51,0,0,1-.1-.28,2.47,2.47,0,0,1-.1-.35c0,.13-.07.25-.1.35l-.1.29Z"
                fill="#fff"
              />
              <path
                d="M104.07,115.6a.4.4,0,0,1,.14.13l3.67,4.77c0-.09,0-.17,0-.25a1.7,1.7,0,0,1,0-.22v-4.46h.81V122h-.46a.36.36,0,0,1-.19,0,.42.42,0,0,1-.14-.13l-3.68-4.76c0,.08,0,.15,0,.23a1.62,1.62,0,0,1,0,.21V122h-.81v-6.46h.48A.42.42,0,0,1,104.07,115.6Z"
                fill="#fff"
              />
              <path
                d="M116.09,118.8a3.73,3.73,0,0,1-.23,1.32,3,3,0,0,1-.65,1,3.16,3.16,0,0,1-1,.66,3.68,3.68,0,0,1-1.31.23h-2.42v-6.46h2.42a3.47,3.47,0,0,1,1.31.24,3,3,0,0,1,1,.65,3.07,3.07,0,0,1,.65,1A3.73,3.73,0,0,1,116.09,118.8Zm-1,0a3,3,0,0,0-.16-1,2,2,0,0,0-.45-.78,2,2,0,0,0-.71-.49,2.52,2.52,0,0,0-.93-.17H111.4v5h1.49a2.52,2.52,0,0,0,.93-.17,2,2,0,0,0,.71-.49,2,2,0,0,0,.45-.78A3,3,0,0,0,115.14,118.8Z"
                fill="#fff"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
