import React from "react";
import { StyleSheet, Text, View, TextInput, Button, Pressable, Alert} from "react-native";
import "../FirebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'; 



export default function App() {
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");

    const auth = getAuth();
    const navigation = useNavigation();
    //const dispatch = useDispatch();

    const createUser = () => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          Alert.alert("Success", `Welcome, ${user.email}!`);
        });
    };

    const Login = () => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            Alert.alert("Success", `Welcome, ${user.email}!`);

            //dispatch(login({ email: user.email, uid: user.uid })); //redux
            navigation.navigate("Home");
        })
        .catch((error) => {
            const errorMessage = error.message;
            Alert.alert("Login Error", errorMessage);
        });
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎵 iTunes Music Cataloger 🎵</Text>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
        ></TextInput>
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          secureTextEntry={true}
        ></TextInput>
        <Pressable style={styles.buttonStyle} onPress={createUser}>
          <Text style={styles.text}>Sign up!</Text>
        </Pressable>
        <Button title="Login!" onPress={Login} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center"
    },
    input: {
      height: 40,
      width: 200,
      margin: 12,
      borderWidth: 1,
      padding: 10
    },
    buttonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    title: {
      position: "absolute",
      top: 50,
      fontSize: 24, 
      fontWeight: "bold", 
      textAlign: "center",
      color: "#000", 
      }
  });