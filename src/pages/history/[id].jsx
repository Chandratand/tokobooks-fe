import axios from "axios";
import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled";
import Layout from "../../components/Layout";

const DetailHistory = ({ detail }) => {
  const TransactionWrapper = styled(Box)`
    background-color: #ffffff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
  `;

  const Title = styled(Typography)`
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 16px;
  `;

  const SubTitle = styled(Typography)`
    font-size: 16px;
    margin-bottom: 8px;
  `;

  const ItemWrapper = styled(Box)`
    padding: 8px;
    background-color: #e5e5e5;
    border-radius: 4px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
  `;

  const ItemTitle = styled(Typography)`
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 8px;
  `;

  const ItemInfo = styled(Typography)`
    font-size: 16px;
    margin-bottom: 4px;
  `;
  return (
    <Layout>
      <TransactionWrapper>
        <Title gutterBottom>Transaction Details</Title>
        <SubTitle gutterBottom>Invoice No.: {detail.invoice}</SubTitle>
        <SubTitle gutterBottom>Date: {detail.date}</SubTitle>
        <SubTitle gutterBottom>User ID: {detail.user}</SubTitle>
        <Box marginTop={2}>
          <Title>Transaction Items</Title>
          {detail.detailTransaction.map((item) => (
            <ItemWrapper key={item.id}>
              <ItemTitle gutterBottom>{item.titleBook}</ItemTitle>
              <ItemInfo gutterBottom>Price: ${item.priceBook}</ItemInfo>
              <ItemInfo gutterBottom>Quantity: {item.quantity}</ItemInfo>
              <ItemInfo gutterBottom>
                Total: ${item.priceBook * item.quantity}
              </ItemInfo>
            </ItemWrapper>
          ))}
        </Box>
      </TransactionWrapper>
    </Layout>
  );
};

export default DetailHistory;

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  const jwtToken = atob(token || null);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // Fetch data from external API
  let detail = {};
  const { id } = context.query;

  try {
    const res = await axios.get(
      `https://tokobooks-production-4868.up.railway.app/api/v1/transactions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    detail = res.data.data;
  } catch (error) {
    return {
      redirect: {
        destination: "/history",
        permanent: false,
      },
    };
  }
  // Pass data to the page via props
  return { props: { detail } };
}
