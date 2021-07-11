import { Container, Text, Button, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onLoginWithGoogle = () => {
    router.push("/api/oauth");
  };

  const onLogin = async () => {
    if (username !== "" && password !== "") {
      await axios.post("/api/login", {
        username,
        password,
      });
    }
  };

  return (
    <Container d="flex" flexDirection="column" alignItems="center">
      <Text fontSize="2xl">Timely</Text>
      <Text>Welcome back!</Text>
      <Button onClick={onLoginWithGoogle}>Log in with Google</Button>
      <Text>or</Text>
      <Input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button width="100%" onClick={onLogin}>
        Log in
      </Button>
      <Text>Create an account</Text>
    </Container>
  );
}
