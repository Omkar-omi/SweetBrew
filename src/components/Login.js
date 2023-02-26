import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Login = () => {
  const { signin, user } = UserAuth();
  const [email, setEmail] = useState("test2@test.com");
  const [password, setPassword] = useState("123456");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = setTimeout(() => {
      if (user !== null) navigate("/");
    }, 1000);

    return () => {
      clearTimeout(checkUser);
    };
  }, [user]);
  console.log();

  const handelLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      await signin(email, password);
      const auth = getAuth();
      const user = auth.currentUser;
      localStorage.setItem("name", user.displayName);
      localStorage.setItem("id", user.uid);
      localStorage.setItem("email", user.email);
      navigate("/");
      setIsPending(false);
    } catch (e) {
      setError("Email or Password dosen't match");
      console.log(e.message);
      setIsPending(false);
    }
  };
  return (
    <div className="flex items-center justify-center mt-32">
      <form
        className="flex flex-col justify-center  sm:border-solid sm:border-2 py-10 sm:px-10 sm:rounded-lg "
        onSubmit={handelLogin}
      >
        <h2 className="text-2xl flex justify-center mb-10 text-white">Login</h2>
        <h2>{error}</h2>
        <label className="text-white">Username :</label>
        <input
          className="border-solid border-2 rounded-lg text-black sm:w-80"
          type="email"
          autoComplete="off"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="mt-2 text-white">Password:</label>
        <input
          className="border-solid border-2 rounded-lg  text-black sm:w-80"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isPending && (
          <button className="btn btn-primary mt-5 mb-5">Login</button>
        )}
        {isPending && (
          <button className="btn loading mt-5 mb-5 text-white btn-disabled">
            Logging in...
          </button>
        )}
        <Link className="text-center underline" to={"/signup"}>
          Dont have an account already?
          <br />
          Click here to Signup
        </Link>
      </form>
    </div>
  );
};

export default Login;
