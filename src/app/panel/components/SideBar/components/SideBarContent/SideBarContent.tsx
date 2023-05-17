'use client';

import {
  AppstoreFilled,
  BookOutlined,
  ContactsOutlined,
  HomeFilled,
  ReadFilled,
  UserOutlined,
} from '@ant-design/icons';
import { EmployeeRole } from '@athena-types/employee';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { getAuthorizedRoutesByRoles } from '@helpers/utils/getAuthorizedRoutesByRoles';
import { Menu, MenuProps } from 'antd';
import { getCookie } from 'cookies-next';
import decode from 'jwt-decode';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';

type MenuItem = Required<MenuProps>['items'][number];

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 24px;
  margin-bottom: 48px;
`;

const SkeletonMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 4px;
`;

function getItem(
  label: string,
  key: React.Key,
  icon?: React.ReactNode,
  items?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    items,
    label,
    type,
  } as MenuItem;
}

export const SideBarContent: React.FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  const accessToken = getCookie('alohomora');

  const { roles } =
    typeof window === 'undefined'
      ? { roles: [EmployeeRole.principal] }
      : (decode(accessToken as string) as { roles: EmployeeRole[] });

  const items: MenuItem[] = [
    getItem('Home', '/panel', <HomeFilled />),
    getItem('Colaboradores', '/panel/employees', <ContactsOutlined />),
    getItem('Alunos', '/panel/students', <UserOutlined />),
    getItem('Disciplinas', '/panel/disciplines', <ReadFilled />),
    getItem('Cursos', '/panel/courses', <BookOutlined />),
    getItem('Salas de aula', '/panel/classrooms', <AppstoreFilled />),
  ];

  const [itemsToShow, setItemsToShow] = useState(items);

  useEffect(() => {
    if (typeof accessToken === 'string') {
      setItemsToShow(
        items.filter((item) =>
          getAuthorizedRoutesByRoles(roles).includes(
            (item?.key as string) ?? ''
          )
        )
      );
    }
  }, [accessToken]);

  return (
    <>
      <LogoContainer>
        <Image
          priority
          width={170}
          height={38}
          src="/svg/white-logo.svg"
          alt="Athena logo"
        />
      </LogoContainer>

      <ClientComponentLoader
        loader={
          <SkeletonMenuContainer>
            <SkeletonTheme
              baseColor="#353746"
              highlightColor="#595c6e"
              height={40}
            >
              {itemsToShow.map((item) => (
                <Skeleton key={item?.key} />
              ))}
            </SkeletonTheme>
          </SkeletonMenuContainer>
        }
      >
        <Menu
          mode="inline"
          items={itemsToShow}
          defaultSelectedKeys={[pathname]}
          onClick={({ key }) => push(key)}
        />
      </ClientComponentLoader>
    </>
  );
};
