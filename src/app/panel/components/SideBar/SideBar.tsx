'use client';

import { HomeFilled, ReadFilled } from '@ant-design/icons';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { Menu, MenuProps, theme } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';

type MenuItem = Required<MenuProps>['items'][number];

const Aside = styled.aside`
  position: fixed;
  top: 0;
  width: 260px;
  height: 100vh;
  background-color: ${(props) => props.bgColor};

  ul {
    background-color: ${(props) => props.bgColor};
    border: none;
    color: white;

    li:not(.ant-menu-item-selected):hover {
      color: white !important;
      background-color: rgb(255 255 255 / 10%) !important;
    }
  }
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

export const SideBar: React.FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { useToken } = theme;
  const { token } = useToken();

  const items: MenuItem[] = [
    getItem('Home', '/panel', <HomeFilled />),
    getItem('Disciplinas', '/panel/disciplines', <ReadFilled />),
  ];

  return (
    <Aside bgColor={token.colorPrimary}>
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
    </Aside>
  );
};
