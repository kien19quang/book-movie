import { Button, Checkbox, Divider, Form, Input, Row, Typography, message } from "antd";
import { getSession, signIn } from "next-auth/react";
import { NextPageContext } from "next/types";
import { useRouter } from "next/router";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCallback, useState } from "react";
import axios from "axios";
import FormLogin from "../../components/Auth/FormLogin";
import FormRegister from "../../components/Auth/FormRegister";
import PosterLogin from '../../public/image/hero.jpg'

export interface SigninProps {
}

const { Text, Title } = Typography

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default function Signin (props: SigninProps) {
  const [showFormLogin, setShowFormLogin] = useState<boolean>(true)

  return (
    <Row style={{ width: '100%', height: '100vh', background: `url(${PosterLogin.src}) center center / cover no-repeat fixed` }} justify='center' align='middle'>
      {showFormLogin ? <FormLogin onChangeForm={() => setShowFormLogin(false)} /> : <FormRegister onChangeForm={() => setShowFormLogin(true)}/>}
    </Row>
  );
}