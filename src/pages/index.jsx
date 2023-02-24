import HistoryIcon from "@mui/icons-material/History";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Container, Grid } from "@mui/material";
import Card from "../components/Card";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <Container sx={{ m: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              label="New Transaction"
              title="Create New Transaction"
              href="/transaction"
              icon={<ShoppingCartIcon color="primary" fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              label="Books"
              title="Available Books :"
              href="/books"
              icon={<LibraryBooksIcon color="primary" fontSize="large" />}
              value={32}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              label="History"
              title="Total Transaction Created : "
              href="/history"
              icon={<HistoryIcon color="primary" fontSize="large" />}
              value={40}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
