import axios from "axios";
import styled from "@emotion/styled";
import Link from "next/link";
import Layout from "../../components/Layout";

const TransactionsWrapper = styled.div`
  background-color: #ffffff;
  padding: 16px;
`;

const TransactionCard = styled.div`
  border: 1px solid #dddddd;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
`;

const TransactionTitle = styled.h3`
  font-size: 20px;
  margin: 0;
  margin-bottom: 16px;
`;

const TransactionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransactionLabel = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const TransactionValue = styled.span``;

const History = ({ list }) => {
  const calculateTotalPrice = (data) => {
    let total = 0;
    data.forEach((transaction) => {
      transaction.detailTransaction.forEach((detail) => {
        total += detail.priceBook * detail.quantity;
      });
    });
    return total;
  };
  const totalQty = (data) => {
    let totalQuantity = 0;
    for (let i = 0; i < data.length; i++) {
      totalQuantity += data[i].quantity;
    }
    return totalQuantity;
  };

  return (
    <Layout>
      <TransactionsWrapper>
        {list.map((transaction) => (
          <TransactionCard key={transaction.id}>
            <Link href={`/history/${transaction.id}`}>
              <TransactionTitle>Transaction #{transaction.id}</TransactionTitle>
              <TransactionDetail>
                <TransactionLabel>Invoice:</TransactionLabel>
                <TransactionValue>{transaction.invoice}</TransactionValue>
              </TransactionDetail>
              <TransactionDetail>
                <TransactionLabel>Date:</TransactionLabel>
                <TransactionValue>
                  {new Date(transaction.date).toLocaleDateString()}
                </TransactionValue>
              </TransactionDetail>
              <TransactionDetail>
                <TransactionLabel>Total Price:</TransactionLabel>
                <TransactionValue>
                  ${calculateTotalPrice(list)}
                </TransactionValue>
              </TransactionDetail>
              <TransactionDetail>
                <TransactionLabel>Number of Item : </TransactionLabel>
                <TransactionValue>
                  {totalQty(transaction.detailTransaction)}
                </TransactionValue>
              </TransactionDetail>
              <TransactionDetail>
                <TransactionLabel>Book List:</TransactionLabel>
                <TransactionValue>
                  {transaction.detailTransaction
                    .map((item) => item.titleBook)
                    .join(", ")}
                </TransactionValue>
              </TransactionDetail>
            </Link>
          </TransactionCard>
        ))}
      </TransactionsWrapper>
    </Layout>
  );
};

export default History;

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
  let list = [];

  try {
    const res = await axios.get(
      `https://tokobooks-production-4868.up.railway.app/api/v1/transactions`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    list = res.data.data;
  } catch (error) {
    return {
      redirect: {
        destination: "/history",
        permanent: false,
      },
    };
  }
  // Pass data to the page via props
  return { props: { list } };
}
