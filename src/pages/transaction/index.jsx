import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

const Transaction = ({ bookList, token }) => {
  const router = useRouter();

  const [selectedValues, setSelectedValues] = useState([
    { option: null, quantity: 1 },
  ]);

  const handleAdd = () => {
    setSelectedValues([...selectedValues, { option: null, quantity: 1 }]);
  };

  const handleChange = (value, index) => {
    const newValues = [...selectedValues];
    newValues[index] = { ...newValues[index], option: value };
    setSelectedValues(newValues);
  };

  const handleChangeQuantity = (event, index) => {
    const newValues = [...selectedValues];
    newValues[index] = { ...newValues[index], quantity: event.target.value };
    setSelectedValues(newValues);
  };

  const handleDelete = (index) => {
    const newValues = [...selectedValues];
    newValues.splice(index, 1);
    setSelectedValues(newValues);
  };

  const createTransaction = async (payload) => {
    try {
      const res = await axios.post(
        `https://tokobooks-production-4868.up.railway.app/api/v1/checkouts`,
        { payload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.data) {
        toast.success(res.data.message);
        setSelectedValues([{ option: null, quantity: 1 }]);
        router.push(`/history/${res.data.data.id}`);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = [];

    for (let i = 0; i < selectedValues.length; i++) {
      if (selectedValues[i].option?.id) {
        payload.push({
          bookId: selectedValues[i].option.id,
          quantity: selectedValues[i].quantity,
        });
      }
    }

    if (payload.length <= 0) {
      toast.error("Anda Belum Memilih Buku");
    } else {
      createTransaction(payload);
    }
  };

  return (
    <Layout>
      <Box sx={{ bgcolor: "white", padding: "16px", borderRadius: "8px" }}>
        <Typography variant="title" component="h1" gutterBottom>
          Create Transaction
        </Typography>
        <form onSubmit={handleSubmit}>
          {selectedValues.map((data, index) => {
            return (
              <Grid key={index} container sx={{ paddingY: 2 }}>
                <Stack flex={1}>
                  <Autocomplete
                    disableClearable
                    disablePortal
                    id="combo-box-demo"
                    options={bookList}
                    getOptionLabel={(option) => option.title}
                    value={data?.option}
                    fullWidth
                    onChange={(event, value) => handleChange(value, index)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose Book"
                        placeholder="Choose Book"
                      />
                    )}
                  />
                </Stack>
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
                <Grid item sm={12}>
                  {data.option && (
                    <Grid container marginTop={2} spacing={2}>
                      <Grid item>
                        <Image
                          src="https://picsum.photos/200/300"
                          width={200}
                          height={300}
                          alt={data.option.title}
                          style={{
                            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <Typography marginBottom={1} fontWeight="bold">
                          Title : {data.option.title}
                        </Typography>
                        <Typography marginBottom={1} fontWeight="bold">
                          Author : {data.option.author}
                        </Typography>
                        <Typography marginBottom={1} fontWeight="bold">
                          Category : {data.option.Category.name}
                        </Typography>
                        <Typography marginBottom={1} fontWeight="bold">
                          Price : ${data.option.price}
                        </Typography>
                        <Typography marginBottom={1} fontWeight="bold">
                          Stock : {data.option.stock}
                        </Typography>

                        <TextField
                          label="Quantity"
                          type="number"
                          value={data.quantity}
                          onChange={(event) =>
                            handleChangeQuantity(event, index)
                          }
                          InputProps={{ inputProps: { min: 1 } }}
                          sx={{ marginTop: 2 }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            );
          })}

          <Button
            variant="contained"
            sx={{ marginRight: 2 }}
            onClick={handleAdd}
          >
            Add Another Book
          </Button>

          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default Transaction;

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
  const { title, category } = context.query;
  let bookList = [];

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

    bookList = res.data.data;
  } catch (error) {
    // s
  }
  // Pass data to the page via props
  return { props: { bookList, token: jwtToken } };
}
