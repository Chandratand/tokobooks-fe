import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";

const columns = [
  { id: "id", label: "ID", minWidth: 1 },
  { id: "title", label: "Title", minWidth: 170 },
  { id: "image", label: "Image", minWidth: 90 },
  { id: "category", label: "Category", minWidth: 100 },
  { id: "author", label: "Author", minWidth: 100 },
  { id: "published", label: "Published", minWidth: 80, align: "center" },
  { id: "price", label: "Price", minWidth: 100, align: "center" },
  { id: "stock", label: "Stock", minWidth: 80, align: "center" },
  { id: "action", label: "Action", minWidth: 80, align: "center" },
];

function createData(
  id,
  title,
  image,
  category,
  author,
  published,
  price,
  stock,
  action
) {
  const date = new Date(published);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("id-ID", options); // 18 Februari 2023

  return {
    id,
    title,
    image,
    category,
    author,
    published: formattedDate,
    price,
    stock,
    action,
  };
}

const Books = ({ bookList, categoryList }) => {
  const router = useRouter();

  const rows = bookList.map((item) => {
    const action = <Button variant="contained">Update</Button>;
    return createData(
      item.id,
      item.title,
      item.image,
      item.Category.name,
      item.author,
      item.published,
      item.price,
      item.stock,
      action
    );
  });
  const [expanded, setExpanded] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    const query = {};
    if (form.title !== "") {
      query.title = form.title;
    }
    if (form.category !== "") {
      query.category = form.category;
    }
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const handleReset = () => {
    setForm({ title: "", category: "" });
    router.push({
      pathname: router.pathname,
    });
  };

  return (
    <Layout>
      <Button
        variant="outlined"
        sx={{ marginBottom: 2, bgcolor: "white" }}
        startIcon={<AddIcon />}
      >
        <Link href="/books/create">Add New Book</Link>
      </Button>
      <Box
        sx={{
          bgcolor: "white",
          marginBottom: "16px",
          borderRadius: "8px",
        }}
      >
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Filter Books
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container marginBottom={2} spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  value={form.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="category"
                    id="demo-simple-select"
                    value={form.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    {categoryList?.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleFilter}>
              Filter
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ marginLeft: "8px" }}
            >
              Reset
            </Button>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ marginBottom: "32px" }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                      style={{ backgroundColor: index % 2 === 0 && "#f9f9f9" }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Books;

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  const jwtToken = atob(token);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // Fetch data from external API
  const { title, category } = context.query;
  let bookList = [];
  let categoryList = [];

  try {
    const res = await axios.get(
      `https://tokobooks-production-4868.up.railway.app/api/v1/books${
        title ? `?title=${title}` : ""
      }${category ? `?category=${category}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    const cat = await axios.get(
      `https://tokobooks-production-4868.up.railway.app/api/v1/categories`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    bookList = res.data.data;
    categoryList = cat.data.data;
  } catch (error) {
    // console.log(error);
  }
  // Pass data to the page via props
  return { props: { bookList, categoryList } };
}
