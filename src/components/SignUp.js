import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase";

const SignUp = () => {
  const [name, setName] = useState("aasas");
  const [email, setEmail] = useState("asas@asas.com");
  const [password, setPassword] = useState("1234567890");
  const [cnfpassword, setcnfPassword] = useState("1234567890");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { createUser } = UserAuth();

  const handelSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    if (password !== cnfpassword) {
      setError("Password dosen't match");
      setIsPending(false);
    } else {
      try {
        const createdUser = await createUser(email, password);
        let dispName = name.charAt(0).toUpperCase() + name.slice(1);

        localStorage.setItem("name", dispName);
        localStorage.setItem("id", createdUser?.user?.uid);
        localStorage.setItem("email", email);

        await setDoc(doc(db, "users", createdUser?.user?.uid), {
          name: createdUser?.user?.displayName,
          cart: {},
          cartvalue: 0,
          address: "",
          favourite: {},
          yourorders: {},
          email: createdUser?.user?.email,
        });
        setTimeout(async () => {
          navigate("/");
        }, 2000);

        await updateProfile(auth.currentUser, {
          displayName: dispName,
        });

        setIsPending(false);
      } catch (e) {
        setError("Email or Password dosen't match");
        console.error(e.message);
        setIsPending(false);
      }
    }
  };
  return (
    <div className="flex items-center justify-center mt-32">
      <form
        className="flex flex-col justify-center  md:border-solid md:border-2 py-10 md:px-10 md:rounded-lg "
        onSubmit={handelSignup}
      >
        <h2 className="text-2xl flex justify-center mb-10 text-white">
          SignUp
        </h2>
        <h2 className="text-red-700 text-center text-2xl mb-5">{error}</h2>
        <label className="text-white">Enter Name :</label>
        <input
          className="border-solid border-2 rounded-lg text-black w-60 md:w-96 "
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <label className="text-white">Enter Email :</label>
        <input
          className="border-solid border-2 rounded-lg text-black w-60 md:w-96 "
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="mt-2 text-white">Password:</label>
        <input
          className="border-solid border-2 rounded-lg  text-black w-60 md:w-96 "
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="mt-2 text-white">Confirm Password:</label>
        <input
          className="border-solid border-2 rounded-lg  text-black w-60 md:w-96 "
          type="password"
          required
          value={cnfpassword}
          onChange={(e) => setcnfPassword(e.target.value)}
        />
        {!isPending && (
          <button className="btn btn-primary mt-5 mb-5">Sign in</button>
        )}
        {isPending && (
          <button className="btn loading mt-5 mb-5 text-white btn-disabled">
            Signing in...
          </button>
        )}
        <Link className="text-center underline" to={"/login"}>
          Have an account?
          <br />
          Click here to Login
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
