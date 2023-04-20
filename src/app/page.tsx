'use client';

import { LockFilled, UserOutlined } from '@ant-design/icons';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { SquareLoader } from '@components/SquareLoader';
import { Button, Form, Input } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

export default function Home() {
  const { push } = useRouter();

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

            <Form size="large">
              <Form.Item required>
                <Input placeholder="E-mail" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item required>
                <Input.Password placeholder="Senha" prefix={<LockFilled />} />
              </Form.Item>

              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={() => push('/panel')}
              >
                Entrar
              </Button>
            </Form>
          </Stack>
        </ClientComponentLoader>
      </Main>
    </div>
  );
}
