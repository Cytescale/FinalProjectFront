import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORE = "@auth_key";
const API_URL =
  "http://ec2-15-207-51-129.ap-south-1.compute.amazonaws.com:3000/api/v1/";

export async function storeAuthData(uid, acctkn, reftkn, account_type) {
  try {
    const obj = {
      uid: uid,
      acctkn: acctkn,
      reftkn: reftkn,
      account_type: account_type,
    };
    const str = JSON.stringify(obj);
    await AsyncStorage.setItem(AUTH_STORE, str);
    return str;
  } catch (e) {
    return e;
  }
}

export async function removeAuthData() {
  try {
    await AsyncStorage.removeItem(AUTH_STORE);
  } catch (e) {
    return e;
  }
}

export async function getAuthData() {
  try {
    const value = await AsyncStorage.getItem(AUTH_STORE);
    if (!value) {
      return null;
    }
    return value;
  } catch (e) {
    return e;
  }
}

//store auth data

export async function doLogin(email, pass) {
  try {
    const str = email + ":" + pass;
    var encodedBuffer = Buffer(str).toString("base64");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${encodedBuffer}`);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    let res = await fetch(API_URL + "login", requestOptions);
    res = await res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function doSignUp(email, pass, account_type) {
  try {
    var myHeaders = new Headers();
    const str = email + ":" + pass;
    var encodedBuffer = Buffer(str).toString("base64");
    myHeaders.append("Authorization", `Basic ${encodedBuffer}`);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      account_type: account_type,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let res = await fetch(API_URL + "createUser", requestOptions);
    res = await res.json();
    return res;
  } catch (e) {
    return e;
  }
}
