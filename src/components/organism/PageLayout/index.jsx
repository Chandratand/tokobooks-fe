import { Layout, theme } from "antd";
import React from "react";
import Sidebar from "../sidebar";

const { Header, Content, Footer } = Layout;
const PageLayout = ({ children }) => {
  return (
    <Layout style={{ maxHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ backgroundColor: "white" }}>
          <div>HEADER</div>
        </Header>
        <Content>
          <div
            style={{
              height: "100%",
              padding: "16px",
              overflow: "auto",
            }}
          >
            {children}
          </div>
        </Content>
        {/* <Footer
          style={{
            padding: "16px",
            backgroundColor: "white",
          }}
        >
          TokoBooks ©2023 Created by Chandra Tandiono
        </Footer> */}
      </Layout>
    </Layout>
  );
};
export default PageLayout;
