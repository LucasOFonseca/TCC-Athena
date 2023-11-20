'use client';

import { LockFilled, UserOutlined } from '@ant-design/icons';
import { ErrorMessages } from '@athena-types/messages';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { SquareLoader } from '@components/SquareLoader';
import { authService } from '@services/auth';
import { useUser } from '@stores/useUser';
import { Button, Form, Input } from 'antd';
import { setCookie } from 'cookies-next';
import decode from 'jwt-decode';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100vh;
  background-color: #3f4257;
  color: #fff;
  min-width: max-content;

  h4 {
    margin-bottom: 24px;
  }

  h6 {
    font-weight: 600;
    margin-top: 8px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 8px;

  div${Stack}:first-of-type {
    display: none;
  }

  div${Stack}:last-of-type {
    width: 100%;
    flex-grow: 1;
  }

  form {
    width: 100%;
    max-width: 415px;
    margin-top: 16px;
  }

  @media (max-width: 900px) {
    width: 100%;
    height: 100vh;
    padding: 40px 8px;

    div${Stack}:first-of-type {
      display: flex;
      color: #212330;
    }
  }
`;

export const LoginPageContent: React.FC = () => {
  const { push } = useRouter();

  const { setUserInfo } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const onFinish = ({ email, password }: typeof initialValues) => {
    setIsLoading(true);

    authService
      .login(email, password)
      .then((token) => {
        const { roles, ...user } = decode(token) as {
          roles: string[];
          email: string;
          name: string;
        };

        setUserInfo(user);

        setCookie('alohomora', token, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
          secure: true,
        });

        if (!roles.length) {
          push('/student');

          return;
        }

        push('/panel');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Aside>
        <Stack>
          <h4>Bem-vindo ao</h4>

          <Image
            width={250}
            height={56}
            src="/svg/white-logo.svg"
            alt="Athena logo"
          />

          <h6>Sistema de Gestão Acadêmica</h6>
        </Stack>

        <Image
          priority
          width={520}
          height={440}
          src="/svg/login-illustration.svg"
          alt="Ilustração"
          style={{ marginTop: 72 }}
        />
      </Aside>

      <Main>
        <ClientComponentLoader loader={<SquareLoader />}>
          <Stack>
            <h4>Bem-vindo ao</h4>

            <Image
              width={250}
              height={56}
              src="/svg/colored-logo.svg"
              alt="Athena logo"
            />

            <h6>Sistema de Gestão Acadêmica</h6>
          </Stack>

          <Stack>
            <p>Faça login para continuar</p>

            <Form
              size="large"
              initialValues={initialValues}
              onFinish={onFinish}
              disabled={isLoading}
            >
              <Form.Item
                required
                name="email"
                rules={[
                  { required: true, message: '' },
                  { type: 'email', message: ErrorMessages.MSGE06 },
                ]}
              >
                <Input placeholder="E-mail" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                required
                name="password"
                rules={[
                  { required: true, message: '' },
                  { type: 'string', min: 8, message: ErrorMessages.MSGE08 },
                  { type: 'string', max: 16, message: ErrorMessages.MSGE09 },
                ]}
              >
                <Input.Password placeholder="Senha" prefix={<LockFilled />} />
              </Form.Item>

              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Entrar
              </Button>
            </Form>
          </Stack>
        </ClientComponentLoader>
      </Main>
    </div>
  );
};
