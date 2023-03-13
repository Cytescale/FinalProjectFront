import React, { useState } from "react";
import style from "../../styles/land.style";
import {
  //   TextInput,
  Button,
  TouchableRipple,
  useTheme,
  Appbar,
  Checkbox,
  Divider,
} from "react-native-paper";
import {
  SafeAreaView,
  Image,
  View,
  Text,
  TextInput,
  ToastAndroid,
} from "react-native";

import { signupStyle as sus } from "../../styles/land.style";
import { doSignUp, storeAuthData } from "../../backend/authHelper";

const SignupScreen = ({ navigation }) => {
  const theme = useTheme();
  const [accType, setaccType] = React.useState(0);
  const [checked, setchecked] = useState(false);
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");

  const doSignUpProcess = async () => {
    if (!email || !pass) {
      ToastAndroid.show("Enter all details", ToastAndroid.SHORT);
      return;
    }
    if (email) {
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        ToastAndroid.show("Email is in invalid format", ToastAndroid.SHORT);
        return;
      }
    }
    if (pass.length < 6) {
      ToastAndroid.show("Enter longer password", ToastAndroid.SHORT);
      return;
    }
    if (!checked) {
      ToastAndroid.show(
        "Please accept all terms and services",
        ToastAndroid.SHORT
      );
      return;
    }
    let res = await doSignUp(email, pass, accType);
    console.log(res);
    if (res.errorBool) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.SHORT);
    } else {
      let resr = await storeAuthData(
        res.response.uid,
        res.response.accessToken,
        res.response.refreshToken,
        accType
      ).catch((e) => {
        console.log(e);
        ToastAndroid.show("Error Occurred " + e, ToastAndroid.SHORT);
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "profileedit", params: { uid: res.response.uid } }],
      });
    }
  };

  return (
    <SafeAreaView style={sus.safe}>
      <View style={sus.view1}>
        <View style={sus.view3}>
          <Text style={sus.text1}>Create an Account</Text>
          <View style={sus.view4}>
            <Text style={sus.text2}>You are a</Text>
            <View style={sus.view5}>
              <TouchableRipple
                onPress={() => {
                  setaccType(0);
                  ToastAndroid.show(
                    "You will signup as Patient",
                    ToastAndroid.SHORT
                  );
                }}
                style={{
                  ...sus.touch2,
                  backgroundColor: accType === 0 ? "#3B82F6" : null,
                  elevation: accType === 0 ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    ...sus.text3,
                    color: accType === 0 ? "#fff" : "#000",
                  }}
                >
                  Patient
                </Text>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => {
                  ToastAndroid.show(
                    "You will signup as Doctor",
                    ToastAndroid.SHORT
                  );
                  setaccType(1);
                }}
                style={{
                  ...sus.touch3,
                  backgroundColor: accType === 1 ? "#3B82F6" : null,
                  elevation: accType === 1 ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    ...sus.text3,
                    color: accType === 1 ? "#fff" : "#000",
                  }}
                >
                  Doctor
                </Text>
              </TouchableRipple>
            </View>
          </View>

          {/* <Text>Email Address</Text> */}
          <Text style={sus.text2}>Email</Text>
          <TextInput
            label={"Email"}
            value={email}
            onChangeText={setemail}
            placeholder="sample@gmail.com"
            style={sus.textinp1}
          />
          <Text style={sus.text2}>Password</Text>
          <TextInput
            label={"Password"}
            value={pass}
            onChangeText={setpass}
            secureTextEntry={true}
            placeholder="Password"
            style={sus.textinp1}
          />
          {/* <Divider style={{ width: "100%", marginTop: 22 }} /> */}

          <View style={sus.view6}>
            <Checkbox
              color="#3B82F6"
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setchecked(!checked);
              }}
            />
            <Text style={sus.text4}>You agree to our Terms of Services</Text>
          </View>
          <Divider style={{ width: "100%", marginTop: 22 }} />
          <View style={sus.view7}>
            <Text style={sus.text5}>Already have an account?</Text>
          </View>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("login");
            }}
            rippleColor="rgba(0, 0, 0, .32)"
            style={sus.touch4}
          >
            <Text style={sus.text6}>Login from here</Text>
          </TouchableRipple>
        </View>
        <View style={sus.view8}>
          <Button
            icon={"plus"}
            textColor="#fff"
            style={{ backgroundColor: theme.colors.primary, padding: 8 }}
            onPress={doSignUpProcess}
          >
            Create
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SignupScreen;
