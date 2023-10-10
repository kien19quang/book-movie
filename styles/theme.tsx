import { ConfigProvider } from 'antd';
import { IBM_Plex_Sans, Roboto } from 'next/font/google';
import * as React from 'react';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['italic', 'normal'],
  subsets: ['vietnamese'],
  display: 'swap',
})

export default function Theme(children: JSX.Element) {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#27A376', colorText: '#101828', fontSizeHeading1: 24, fontSizeHeading2: 20, borderRadius: 8, fontFamily: roboto.style.fontFamily },
        components: {
          Menu: {
            borderRadius: 8,
            itemMarginInline: 16,
            itemHoverBg: '#d5e3dc',
            itemHoverColor: '#27A376',
          },
          Input: {
            controlHeight: 36,
            activeShadow: 'none'
          },
          Button: {
            controlHeight: 36,
          },
          Tooltip: {
            colorBgSpotlight: '#545454eb'
          },
          Dropdown: {
            controlHeight: 36
          },
          Card: {
            padding: 20,
            paddingLG: 20
          },
          Upload: {
            paddingXS: 0,
            borderRadiusLG: 8,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}