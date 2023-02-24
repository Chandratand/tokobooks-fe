import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNjc3MjUzODMwLCJleHAiOjE2NzcyNTc0MzB9.2DzqiohsvlS6WEYXNhSVtgkbjUn0j1qIDlxOHeREw6w";

const Create = ({ categoryList }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    image: "Images",
    category: "",
    published: null,
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://tokobooks-production-4868.up.railway.app/api/v1/books`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.data) {
        toast(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <Layout>
      <Box sx={{ bgcolor: "white", padding: "16px", borderRadius: "8px" }}>
        <Typography variant="title" component="h1" gutterBottom>
          Input New Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            name="author"
            label="Author"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="category"
              id="demo-simple-select"
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
            onChange={handleChange}
          />
          <TextField
            name="stock"
            label="Stock"
            fullWidth
            type="number"
            margin="dense"
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ marginY: 2 }}
            startIcon={<AddIcon />}
          >
            Add New Book
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default Create;

export async function getServerSideProps() {
  // Fetch data from external API
  let categoryList = [];

  try {
    const cat = await axios.get(
      `https://tokobooks-production-4868.up.railway.app/api/v1/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    categoryList = cat.data.data;
  } catch (error) {
    console.log(error);
  }
  // Pass data to the page via props
  return { props: { categoryList } };
}
