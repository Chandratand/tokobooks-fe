import React, { useEffect } from "react";
import {
  HomeOutlined,
  BookOutlined,
  UnorderedListOutlined,
  ShopOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "../atoms/Logo";

const { Sider } = Layout;

const Sidebar = () => {
  const menu = [
    {
      icon: <HomeOutlined />,
      key: "/",
      label: <Link href="/">Dashboard</Link>,
    },
    {
      icon: <ShopOutlined />,
      key: "/order",
      label: <Link href="/order">Order</Link>,
    },
    {
      icon: <BookOutlined />,
      key: "/books",
      label: <Link href="/books">Books</Link>,
    },
    {
      icon: <UnorderedListOutlined />,
      key: "/transaction-history",
      label: <Link href="/transaction-history">History</Link>,
    },
  ];

  const router = useRouter();

  return (
    <Sider
      breakpoint="lg"
      // onBreakpoint={(broken) => {
      //   console.log(broken);
      // }}
      // onCollapse={(collapsed, type) => {
      //   console.log(collapsed, type);
      // }}
      style={{ height: "100vh", backgroundColor: "white" }}
    >
      <Logo />
      <Menu selectedKeys={[router.route]} items={menu} />
    </Sider>
  );
};

export default Sidebar;
