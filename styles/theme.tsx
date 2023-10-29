import { ConfigProvider } from 'antd';
import { IBM_Plex_Sans, Poppins, Roboto } from 'next/font/google';
import * as React from 'react';

const poppins = Poppins({
  weight: ['400', '500', '700'],
  style: ['italic', 'normal',],
  subsets: ['devanagari'],
  display: 'swap',
})

export default function Theme(children: JSX.Element) {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#6f57eb', colorText: '#101828', fontSizeHeading1: 24, fontSizeHeading2: 20, borderRadius: 8, fontSize: 16 },
        components: {
          Menu: {
            borderRadius: 8,
            itemMarginInline: 16,
            itemHoverBg: '#f5f0ff',
            itemHoverColor: '#6f57eb',
          },
          Input: {
            controlHeight: 36,
            activeShadow: 'none'
          },
          Button: {
            controlHeight: 36,
            colorLink: '#6f57eb',
            colorLinkHover: '#6f57ebcc'
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
