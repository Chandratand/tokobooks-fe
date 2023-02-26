import axios from "axios";
import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const DetailBook = ({ book }) => {
  const router = useRouter();
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ paddingBottom: 4 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={8} order={2}>
            <Box
              sx={{
                bgcolor: "white",
                padding: "16px",
                borderRadius: "8px",
                mb: 2,
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Typography variant="h4">{book.title}</Typography>
              <Typography variant="subtitle1">by {book.author}</Typography>
              <Typography variant="subtitle2">{book.Category.name}</Typography>
              <Typography variant="h6">${book.price}</Typography>
              <Typography variant="subtitle2">
                {book.stock} left in stock
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => {}}>
              Edit Book
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                router.back();
              }}
              sx={{ marginLeft: "8px", bgcolor: "white" }}
            >
              Go Back
            </Button>
          </Grid>
          <Grid item sm={12} md={3} order={1}>
            <div>
              <Image
                src="https://picsum.photos/200/300"
                width={200}
                height={300}
                alt={book.title}
                style={{
                  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default DetailBook;

export async function getServerSideProps({ req, query }) {
  const { token } = req.cookies;
  const jwtToken = atob(token || null);

  const { id } = query;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // Fetch data from external API
  let detail = "";

  try {
    const res = await axios.get(
      `https://tokobooks-production-4868.up.railway.app/api/v1/books/${id}`,
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
        destination: "/books",
        permanent: false,
      },
    };
  }
  // Pass data to the page via props
  return { props: { book: detail, token: jwtToken } };
}
