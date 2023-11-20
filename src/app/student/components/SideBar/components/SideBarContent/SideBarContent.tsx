'use client';

import {
  CarryOutOutlined,
  FileDoneOutlined,
  HomeFilled,
} from '@ant-design/icons';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { Menu, MenuProps } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  getItem('Home', '/student', <HomeFilled />),
  getItem('Frequências', '/student/attendances', <CarryOutOutlined />),
  getItem('Notas', '/student/grades', <FileDoneOutlined />),
];

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
              {items.map((item) => (
                <Skeleton key={item?.key} />
              ))}
            </SkeletonTheme>
          </SkeletonMenuContainer>
        }
      >
        <Menu
          mode="inline"
          items={items}
          defaultSelectedKeys={[pathname]}
          onClick={({ key }) => push(key)}
        />
      </ClientComponentLoader>
    </>
  );
};
