import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const FormContainer = styled(Box)`
  background-color: #ffffff;
  padding: 16px;
  border-radius: 5px;
  max-width: 300px;
  margin: auto;
  margin-top: ${({ theme }) => theme.spacing(8)}px;
  padding: ${({ theme }) => theme.spacing(3)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
`;

const SubmitButton = styled(Button)`
  margin: ${({ theme }) => theme.spacing(3, 0, 2)}px;
`;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://tokobooks-production-4868.up.railway.app/api/v1/signin`,
        { email, password }
      );
      toast.success("Login Berhasil");
      const { token } = res.data.data;
      const tokenBase64 = btoa(token);
      Cookies.set("token", tokenBase64, { expires: 1 });
      router.push("/");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <FormContainer component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </SubmitButton>
        </Form>
      </FormContainer>
    </Box>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
