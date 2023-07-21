import { View, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";

import { Formik } from "formik";
import * as yup from "yup";

import FormikTextInput from "./FormikTextInput";
import Button from "./Button";

import useSignIn from "../hooks/useSignIn";


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  formContainer: {
    margin: 10,
  },
  formItem: {
    margin: 5,
  },
});

const SignInForm = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <FormikTextInput
          style={styles.formItem}
          name="username"
          placeholder="Username"
        />
        <FormikTextInput
          name="password"
          placeholder="Password"
          style={styles.formItem}
          secureTextEntry={true}
        />
        <Button
          text="Sign in"
          color="white"
          style={styles.formItem}
          fontWeight="bold"
          fontSize="subheading"
          onSubmit={onSubmit}
        />
      </View>
    </View>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signIn({ username, password });
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

export default SignIn;
