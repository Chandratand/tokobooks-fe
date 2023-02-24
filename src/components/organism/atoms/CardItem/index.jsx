import { Card, Col } from "antd";
import Link from "next/link";
import React from "react";

const CardItem = ({ title, body, href }) => {
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      md={{ span: 12 }}
      lg={{ span: 8 }}
    >
      <Link href={href}>
        <Card className="card" title={title} bordered={false} style={{}}>
          <p>{body}</p>
        </Card>
      </Link>
    </Col>
  );
};

export default CardItem;
