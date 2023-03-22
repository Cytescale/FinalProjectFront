import React, {
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import {
  Alert,
  RefreshControl,
  Dimensions,
  Platform,
  ToastAndroid,
} from "react-native";
import {
  TextInput,
  TouchableRipple,
  useTheme,
  Avatar,
  Button,
  Menu,
  Portal,
  Modal,
  IconButton,
  ActivityIndicator,
  Switch,
  Appbar,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, ScrollView } from "react-native";
import { doctoraddPatientStyle as das } from "../../styles/land.style";
import { doctorCreateReportStyle as dcr } from "../../styles/land.style";
import * as DocumentPicker from "expo-document-picker";
import { getAuthData } from "../../backend/authHelper";
import MatIcon from "@expo/vector-icons/MaterialIcons";
import {
  getUserDatabyUID,
  createRelation,
  createRecord,
} from "../../backend/dbHelper";
import * as FileSystem from "expo-file-system";

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

export const MCollapsible = ({ title, children, style }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <View
      style={{
        ...style,
        flex: 1,
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#F5F1FF",
      }}
    >
      <TouchableRipple
        rippleColor="rgba(0,0,0,0.25)"
        onPress={() => {
          setOpen(!open);
        }}
        style={{
          padding: 22,
          paddingVertical: 22,
          backgroundColor: "#F5F1FF",
          borderBottomColor: "#f2f2f2",
          borderBottomWidth: open ? 1 : 0,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter-Medium",
              color: "#000",
            }}
          >
            {title}
          </Text>
          {open ? (
            <MatIcon name="keyboard-arrow-up" size={26} />
          ) : (
            <MatIcon name="keyboard-arrow-down" size={26} />
          )}
        </View>
      </TouchableRipple>
      {open && <View>{children}</View>}
    </View>
  );
};

const CreateRecordPane = ({ route, navigation }) => {
  const pram = route ? route.params : null;
  const [drid, setdrid] = useState(null);
  const [patid, setpatid] = useState("");
  const [patData, setpatData] = useState(null);

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const theme = useTheme();
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [fileData, setfileData] = useState(null);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [loading, setLoading] = useState(false);

  const [med, setmed] = useState([]);
  const [medArr, setMedArr] = useState([]);
  const [treat, setTreat] = useState("");
  const [medNam, setmedName] = useState("");
  const [medQun, setmedQun] = useState(0);

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
      let pDataRes = await getUserDatabyUID(pram.pid.toString());
      if (!pDataRes.errorBool) {
        setpatData(pDataRes.response);
      }
      setdrid(authData.uid);
    };
    run();
  }, []);

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
    hideModal();
    setmedQun(0);
  };

  const addRecord = async () => {
    if (
      !drid ||
      !patid ||
      treat.length == 0 ||
      (medArr.length == 0 && !fileData)
    ) {
      ToastAndroid.show("Enter valid data", ToastAndroid.SHORT);
      return;
    }
    let res = await createRelation(drid, patid).catch((e) => {
      console.log(e);
    });
    if (res.errorBool) {
      Alert.alert(res.errorMessage);
    } else {
      ToastAndroid.show(
        JSON.stringify("Successfully Added Patients"),
        ToastAndroid.SHORT
      );
    }
    let recRes = await createRecord(drid, patid, treat, medArr, fileData).catch(
      (e) => {
        console.log(e);
        Alert.alert(e);
      }
    );
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
    setLoading(false);
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
    setLoading(false);
  };

  const processAddClick = async () => {
    setLoading(true);
    if (!isSwitchOn) {
      addRelation();
    } else {
      addRecord();
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      }).then((as) => {
        if (as.type == "success")
          if (as.mimeType !== "application/pdf") {
            throw "Invalid file";
          }
        if (as.size > 256000) {
          throw "File is more than 1mb";
        }
        let { name, size, uri } = as;
        if (Platform.OS === "android" && uri[0] === "/") {
          uri = `file://${uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        // console.log(fileToUpload, "...............file");
        setfileData(fileToUpload);
      });
    } catch (e) {
      Alert.alert(e);
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Add Report/Patient" subtitle={"Subtitle"} />
      </Appbar.Header>
      <StatusBar backgroundColor="#fefefe" style={"dark"} animated />
      <View
        style={{
          backgroundColor: theme.colors.background,
          minHeight: "100%",
          height: "100%",
        }}
      >
        <ScrollView style={{ padding: 22, paddingVertical: 0 }}>
          <Text style={{ fontSize: 32, paddingVertical: 22 }}>Patient</Text>
          <View
            style={{
              backgroundColor: theme.colors.tertiaryContainer,
              padding: 16,
              borderRadius: 12,
              marginBottom: 22,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MatIcon name="lightbulb-outline" size={22} />
            <Text style={{ marginLeft: 8, color: "#000", fontSize: 16 }}>
              Add Patient or create a report for the patient
            </Text>
          </View>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              style={{ padding: 22 }}
              contentContainerStyle={{
                backgroundColor: "#fff",
                padding: 28,
                paddingVertical: 32,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>Medicine</Text>
              <TextInput
                mode="outlined"
                label={"Medicine Name"}
                value={medNam}
                onChangeText={setmedName}
                style={{ marginTop: 22 }}
              />
              <TextInput
                mode="outlined"
                label={"Medicine  Quantity"}
                style={{ marginTop: 12 }}
                value={medQun}
                onChangeText={setmedQun}
              />
              <Button
                onPress={() => {
                  AddMed();
                }}
                mode="contained-tonal"
                style={{ marginTop: 22 }}
              >
                Add
              </Button>
            </Modal>
          </Portal>
          <MCollapsible title={"Patient Information"}>
            <View
              style={{
                paddingHorizontal: 22,
                paddingBottom: 32,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TextInput
                mode="outlined"
                value={patid}
                label="Patient Unique ID"
                outlineColor="#fff"
              />

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                  marginTop: 22,
                }}
              >
                <View style={{ display: "flex", flex: 1, marginRight: 8 }}>
                  <TextInput
                    mode="outlined"
                    value={patData ? patData.fname : ""}
                    label={"First Name"}
                    outlineColor="#fff"
                  />
                </View>
                <View style={{ display: "flex", flex: 1, marginLeft: 8 }}>
                  <TextInput
                    mode="outlined"
                    outlineColor="#fff"
                    value={patData ? patData.lname : ""}
                    label={"Last Name"}
                  />
                </View>
              </View>
            </View>
          </MCollapsible>

          <View style={dcr.view1}>
            <Text style={{ fontSize: 18, fontFamily: "Inter-Medium" }}>
              Add Report?
            </Text>
            <Switch
              color="#3B82F6"
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>

          {isSwitchOn && (
            <>
              <MCollapsible title={"Report Details"}>
                <View
                  style={{
                    padding: 22,
                    paddingBottom: 32,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <View style={{}}>
                    <TextInput
                      label={"Treatment for"}
                      mode="outlined"
                      outlineColor="#fff"
                      value={treat}
                      onChangeText={(t) => {
                        setTreat(t);
                      }}
                    />
                  </View>
                  <MedicineTableRender medList={med} delMed={delMed} />
                  <Button
                    onPress={showModal}
                    mode="contained-tonal"
                    style={{ marginTop: 22 }}
                  >
                    Add Medication
                  </Button>
                </View>
              </MCollapsible>
              <MCollapsible title={"Report Files"}>
                <View
                  style={{
                    padding: 22,
                    paddingTop: 0,
                    // paddingBottom: 32,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {fileData ? (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                        backgroundColor: "#fff",
                        marginTop: 0,
                        borderRadius: 12,
                      }}
                    >
                      <MatIcon name="file-present" size={32} />
                      <View
                        style={{ display: "flex", flex: 1, marginLeft: 12 }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: theme.colors.tertiary,
                          }}
                        >
                          {fileData.name.substring(0, 20)}...
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.colors.secondary,
                          }}
                        >
                          {fileData.size / 1000000} Mb
                        </Text>
                      </View>
                      <View>
                        <TouchableRipple
                          onPress={() => {
                            setfileData(null);
                          }}
                          rippleColor="rgba(0,0,0,0.25)"
                          style={{
                            padding: 5,
                            overflow: "hidden",
                            borderRadius: 120,
                            backgroundColor: theme.colors.errorContainer,
                          }}
                        >
                          <MatIcon
                            name="delete"
                            size={22}
                            color={theme.colors.error}
                          />
                        </TouchableRipple>
                      </View>
                    </View>
                  ) : (
                    <Button
                      onPress={handleDocumentPick}
                      style={{
                        backgroundColor: theme.colors.tertiary,
                        marginTop: 0,
                        height: 42,
                      }}
                      textColor={theme.colors.onTertiary}
                    >
                      Upload Report File
                    </Button>
                  )}
                </View>
              </MCollapsible>
            </>
          )}

          <TouchableRipple
            onPress={processAddClick}
            rippleColor="rgba(0,0,0,0.25)"
            style={{
              ...dcr.addButtCont,
              marginBottom: 200,
              backgroundColor: theme.colors.primary,
              borderRadius: 120,
            }}
            disabled={loading}
          >
            {!loading ? (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Inter-Medium",
                }}
              >
                Add
              </Text>
            ) : (
              <ActivityIndicator color="#fff" size={"small"} />
            )}
          </TouchableRipple>
        </ScrollView>
      </View>
    </>
  );
};

export default CreateRecordPane;
