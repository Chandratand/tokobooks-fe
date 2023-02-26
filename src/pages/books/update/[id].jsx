import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";

const UpdateBook = ({ book, token }) => {
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    image: "Images",
    category: book.Category.id,
    published: book.published,
    price: book.price,
    stock: book.stock,
  });
  const [categoryList, setCategoryList] = useState([]);

  const router = useRouter();

  const getCategory = async () => {
    try {
      const res = await axios.get(
        `https://tokobooks-production-4868.up.railway.app/api/v1/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryList(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://tokobooks-production-4868.up.railway.app/api/v1/books/${book.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.data) {
        toast.success(res.data.message);
        setForm({
          title: "",
          author: "",
          image: "Images",
          category: null,
          published: null,
          price: "",
          stock: "",
        });
        router.push("/books");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <Layout>
      <Box sx={{ bgcolor: "white", padding: "16px", borderRadius: "8px" }}>
        <Typography variant="title" component="h1" gutterBottom>
          Update Book Data
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            margin="dense"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            name="author"
            label="Author"
            fullWidth
            margin="dense"
            value={form.author}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="category"
              id="demo-simple-select"
              label="Category"
              value={form.category}
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
          <FormControl fullWidth margin="dense">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Published Date"
                value={form.published}
                onChange={(newValue) =>
                  setForm({ ...form, published: newValue })
                }
                renderInput={(params) => (
                  <TextField name="published" {...params} />
                )}
              />
            </LocalizationProvider>
          </FormControl>

          <TextField
            name="price"
            label="Price"
            fullWidth
            type="number"
            margin="dense"
            value={form.price}
            onChange={handleChange}
          />
          <TextField
            name="stock"
            label="Stock"
            fullWidth
            type="number"
            value={form.stock}
            margin="dense"
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" sx={{ marginY: 2 }}>
            Update Book
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default UpdateBook;

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
