import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  TouchableRipple,
  useTheme,
  Appbar,
  Divider,
  Switch,
} from "react-native-paper";
import { Text, View, ScrollView, ToastAndroid, TextInput } from "react-native";
import { doctoraddPatientStyle as das } from "../../styles/land.style";
import MTextInput from "./searchInp";
import { createRecord, createRelation } from "../../backend/dbHelper";
import { getAuthData } from "../../backend/authHelper";
import { cos } from "react-native-reanimated";

const MedicineTableRender = ({ medList, delMed }) => {
  return (
    <View style={das.view1}>
      <View style={das.view2}>
        <Text style={das.text1}>Name</Text>
        <Text style={das.text2}>Quantity</Text>
      </View>
      {medList.map((e, i) => {
        return (
          <TouchableRipple
            key={i}
            rippleColor="rgba(0,0,0,0.1)"
            onPress={() => {
              delMed(i);
            }}
          >
            <View key={i} style={das.view3}>
              <Text style={das.text3}>{e.name}</Text>
              <Text style={das.text4}>{e.quan}</Text>
            </View>
          </TouchableRipple>
        );
      })}
    </View>
  );
};

const makeToast = (string) => {
  ToastAndroid.show(string, ToastAndroid.SHORT);
};

const DoctorAddPatientScreen = ({ route, navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const pram = route ? route.params : null;
  const [med, setmed] = useState([]);
  const theme = useTheme();
  const [patid, setpatid] = useState("");
  const [medNam, setmedName] = useState("");
  const [medQun, setmedQun] = useState(0);
  const [drid, setdrid] = useState(null);
  const [treat, setTreat] = useState("");
  const [medArr, setMedArr] = useState([]);

  useLayoutEffect(() => {
    if (pram) {
      if (pram.pid) {
        setpatid(pram.pid.toString());
      }
      if (pram.add) {
        setIsSwitchOn(true);
      }
    }
    const run = async () => {
      let authData = await getAuthData();
      authData = JSON.parse(authData);
      setdrid(authData.uid);
    };
    run();
  }, []);

  const addRecord = async () => {
    if (!drid || !patid || treat.length == 0 || medArr.length == 0) {
      ToastAndroid.show("Enter all data", ToastAndroid.SHORT);
      return;
    }
    let res = await createRelation(drid, patid).catch((e) => {
      console.log(e);
    });
    if (res.errorBool) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        JSON.stringify("Successfully Added Patients"),
        ToastAndroid.SHORT
      );
    }
    let recRes = await createRecord(drid, patid, treat, medArr).catch((e) => {
      console.log(e);
    });
    if (recRes.errorBool) {
      console.log(recRes.errorMessage);
      ToastAndroid.show(recRes.errorMessage, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        JSON.stringify("Successfully Added Record"),
        ToastAndroid.SHORT
      );
      navigation.navigate("doctorpatientreport", {
        cid: recRes.response.id,
      });
    }
  };

  const addRelation = async () => {
    let res = await createRelation(drid, patid).catch((e) => {
      console.log(e);
    });
    if (res.errorBool) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        JSON.stringify("Successfully Added Patients"),
        ToastAndroid.SHORT
      );
      navigation.navigate("doctorpatient", {
        uid: res.response.patient_uid,
      });
    }
  };

  const processAddClick = () => {
    if (!isSwitchOn) {
      addRelation();
    } else {
      addRecord();
    }
    // console.log("asds");
  };

  const delMed = (i) => {
    let medLst = med;
    let medArrTmp = medArr;
    medLst.splice(i, 1);
    medArrTmp.splice(i, 1);
    let newList = [...medLst];
    let newMedArrList = [...medArrTmp];
    setmed(newList);
    setMedArr(newMedArrList);
  };

  const AddMed = (e) => {
    if (!medNam) {
      makeToast("No Medicine Name");
      return;
    }
    if (!medQun) {
      makeToast("No Medicine Quantity");
      return;
    }
    if (medNam.length < 1) {
      makeToast("Invalid Medicine Name");
      return;
    }
    if (medQun == 0) {
      makeToast("Not enough quantity");
      return;
    }

    const medi = {
      name: medNam,
      quan: medQun,
    };
    let mediList = med ? [...med, medi] : [medi];
    let medArrTemp = medArr ? [...medArr, medNam] : [medNam];
    setMedArr(medArrTemp);
    setmed(mediList);
    setmedName("");
    setmedQun(0);
  };

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Add Patient" />
        <Appbar.Action icon={"plus"} onPress={processAddClick} />
      </Appbar.Header>
      <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
        <View style={das.view9}>
          <Text
            style={{
              ...das.text10,
              color: theme.colors.secondary,
            }}
          >
            Patient's ID
          </Text>
          <TextInput
            placeholder="Enter Id"
            style={das.textinp2}
            value={patid}
            onChangeText={(t) => {
              setpatid(t);
            }}
          />
        </View>
        <View style={das.view9}>
          <Text
            style={{
              ...das.text10,
              color: theme.colors.secondary,
            }}
          >
            Add a Treament?
          </Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
        {isSwitchOn && (
          <View style={{ backgroundColor: "#fefefe" }}>
            <View style={das.view9}>
              <Text
                style={{
                  ...das.text10,
                  color: theme.colors.secondary,
                }}
              >
                Treating for
              </Text>
              <TextInput
                placeholder="Enter treatment name"
                style={das.textinp2}
                value={treat}
                onChangeText={(t) => {
                  setTreat(t);
                }}
              />
            </View>
            <View style={das.view9}>
              <Text
                style={{
                  ...das.text10,
                  color: theme.colors.secondary,
                }}
              >
                Name
              </Text>
              <TextInput
                placeholder="Enter medicine name"
                style={das.textinp2}
                value={medNam}
                onChangeText={(t) => {
                  setmedName(t);
                }}
              />
            </View>
            <View style={das.view9}>
              <Text
                style={{
                  ...das.text10,
                  color: theme.colors.secondary,
                }}
              >
                Quantity
              </Text>
              <TextInput
                placeholder="Enter Quantity"
                style={das.textinp2}
                value={medQun}
                onChangeText={(t) => {
                  setmedQun(t);
                }}
              />
            </View>
            <TouchableRipple
              rippleColor="rgba(0,0,0,0.1)"
              onPress={() => {
                AddMed();
              }}
              style={{
                backgroundColor: theme.colors.secondary,
                ...das.touch1,
              }}
            >
              <Text
                style={{
                  ...das.text5,
                  color: theme.colors.onSecondary,
                }}
              >
                Add Medicine
              </Text>
            </TouchableRipple>
            <MedicineTableRender medList={med} delMed={delMed} />
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default DoctorAddPatientScreen;
