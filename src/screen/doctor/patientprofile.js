import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import {
  TouchableRipple,
  useTheme,
  Appbar,
  Avatar,
  Modal,
  Portal,
  TextInput,
  Provider,
  IconButton,
  Chip,
  Button,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Text, View, ScrollView, Dimensions, ToastAndroid } from "react-native";
import { doctorPatientProfileStyle as dps } from "../../styles/land.style";
import { SafeAreaView } from "react-native-safe-area-context";

import MTextInput from "./searchInp";
import patientData from "../../../assets/fakedata/patientData.json";
import reportData from "../../../assets/fakedata/reportData.json";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import { getAuthData } from "../../backend/authHelper";
import {
  getUserDatabyUID,
  getRelationsByDID,
  getRecordsByPID,
} from "../../backend/dbHelper";

const RenderPills = ({ mindte, cancelMinDate }) => {
  if (mindte) {
    return (
      <View style={{ flexDirection: "row", display: "flex" }}>
        <Chip
          icon="calendar"
          onPress={cancelMinDate}
          mode="flat"
          style={{ alignContent: "flex-start" }}
        >
          From : {new Date(mindte).toDateString()}
        </Chip>
      </View>
    );
  }
};
const dataMap = [
  {
    id: 1,
    text: "Borreliosis",
  },
  {
    id: 2,
    text: "Cholera",
  },
  {
    id: 3,
    text: "Ciguatera fish poisoning (CFP)",
  },
  {
    id: 4,
    text: "Coronavirus",
  },
  {
    id: 5,
    text: "Diphtheria",
  },
  {
    id: 6,
    text: "Flu",
  },
  {
    id: 7,
    text: "Malaria",
  },
  {
    id: 8,
    text: "Chickenpox (varicella)",
  },
  {
    id: 9,
    text: "Diphtheria",
  },
];
const RenderPatientTable = ({ report, theme, navigation }) => {
  const [searchString, setsearchString] = useState("");
  const [mindt, setmindt] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const cancelMinDate = () => setmindt(null);

  return (
    <>
      <View style={dps.view1}>
        <View style={dps.view3}>
          <View style={dps.view12}>
            <MTextInput
              dataMap={dataMap}
              text={searchString}
              setText={setsearchString}
              mode="outlined"
              placeholder="Search"
              height={24}
              style={{
                flex: 1,
                flexGrow: 1,
                display: "flex",
                backgroundColor: "#f5f5f5",
              }}
              outlineStyle={{
                height: 42,
                borderRadius: 120,
                borderWidth: 0,
              }}
              dense={true}
            />
            {/* <TextInput
              mode="outlined"
              placeholder="Search"
              onChangeText={(t) => {
                setsearchString(t);
              }}
              height={24}
              style={{
                flex: 1,
                flexGrow: 1,
                backgroundColor: "#f5f5f5",
              }}
              outlineStyle={{
                borderRadius: 12,
                borderWidth: 0,
              }}
              dense
              left={<TextInput.Icon icon="magnify" />}
            /> */}
            <Button
              icon="calendar-edit"
              iconColor={"#000"}
              backgroundColor={"#f5f5f5"}
              size={24}
              style={{
                marginLeft: 12,
                borderRadius: 12,
                marginTop: 8,
                backgroundColor: "#f5f5f5",
              }}
              onPress={() => {
                DateTimePickerAndroid.open({
                  value: new Date(),
                  maximumDate: new Date(),
                  minimumDate: new Date(1950, 0, 1),
                  onChange: (event, date) => {
                    let dte = new Date(date);
                    setmindt(dte);
                  },
                });
              }}
            >
              From
            </Button>
          </View>

          <RenderPills mindte={mindt} cancelMinDate={cancelMinDate} />
          <View style={dps.view4}>
            <Text
              style={{
                ...dps.text1,
                color: theme.colors.tertiary,
              }}
            >
              Treatment For
            </Text>
            <Text
              style={{
                color: theme.colors.tertiary,
                ...dps.text2,
              }}
            >
              Date
            </Text>
          </View>
          {report.map((e, i) => {
            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            let cdte = new Date(Date.parse(e.created_at));
            let month = months[cdte.getMonth()];

            // let month = cdte.toLocaleString("default", { month: "short" });
            if (mindt && cdte) {
              if (mindt > cdte) return null;
            }

            if (
              searchString.length > 0 &&
              !e.treat_id.toLowerCase().includes(searchString.toLowerCase()) &&
              !e.treat_id.toLowerCase().includes(searchString.toLowerCase())
            )
              return null;
            return (
              <TouchableRipple
                key={i}
                rippleColor="rgba(0,0,0,0.09)"
                onPress={() => {
                  navigation.navigate("doctorpatientreport", {
                    cid: e.id,
                  });
                }}
                style={dps.touch1}
              >
                <View style={dps.view5}>
                  <View style={dps.view6}>
                    <Text style={dps.text3}>{e.treat_id.substring(0, 22)}</Text>
                    <Text
                      style={{ fontSize: 12, color: theme.colors.secondary }}
                    >
                      {e.id}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      ...dps.text4,
                    }}
                  >
                    {cdte.getDate()} {month}
                  </Text>
                </View>
              </TouchableRipple>
            );
          })}
        </View>
      </View>
    </>
  );
};

const DoctorPatientProfileScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const pram = route ? route.params : null;
  const [pData, setpData] = useState(null);
  const [repor, setrepor] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (pram) {
      console.log(pram.uid);
      const run = async () => {
        const userDataRes = await getUserDatabyUID(pram.uid);
        if (!userDataRes.errorBool) {
          const userDataPar = userDataRes.response;
          setpData(userDataPar);
        }

        const recordsDataRes = await getRecordsByPID(pram.uid);
        if (!recordsDataRes.errorBool) {
          setrepor(recordsDataRes.response);
        } else {
          setrepor([]);
          ToastAndroid.show(recordsDataRes.errorMessage, ToastAndroid.SHORT);
          console.log(recordsDataRes.errorMessage);
        }
        setLoading(false);
      };
      run();
    }
  }, []);

  if (!pram || !pData)
    return (
      <>
        <SafeAreaView>
          <Text>No Data</Text>
        </SafeAreaView>
      </>
    );
  if (loading)
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Patient Profile" />
        </Appbar.Header>
        <SafeAreaView
          style={{
            // height: "100%",
            backgroundColor: "#fff",
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="#000" size={"large"} />
        </SafeAreaView>
      </>
    );
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Patient Profile" />
        <Appbar.Action icon={"information-outline"} onPress={showModal} />
      </Appbar.Header>
      <ScrollView>
        <View
          style={{
            ...dps.view7,
            backgroundColor: theme.colors.background,
            minHeight: Dimensions.get("window").height,
          }}
        >
          <View colors={["#eff6ff", "rgba(255,255,255,0)"]} style={dps.view8}>
            <Avatar.Text label={pData.fname[0]} size={82} />

            <Text
              style={{
                color: theme.colors.onPrimaryContainer,
                ...dps.text5,
              }}
            >
              {pData.fname} {pData.lname}
            </Text>
            <Text
              style={{
                color: theme.colors.onPrimaryContainer,
                ...dps.text6,
              }}
            >
              #
              {pData.uid.substr(1, 4) +
                "....." +
                pData.uid.substr(pData.uid.length - 4, pData.uid.length)}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 12,
              }}
            >
              <Button
                textColor={theme.colors.error}
                style={{
                  width: 120,
                  backgroundColor: theme.colors.errorContainer,
                  marginRight: 3,
                }}
              >
                Remove
              </Button>
              <Button
                onPress={() => {
                  navigation.navigate("doctoradd", {
                    pid: pData.pid,
                    add: true,
                  });
                }}
                textColor={theme.colors.primary}
                style={{
                  width: 120,
                  backgroundColor: theme.colors.primaryContainer,
                  marginLeft: 3,
                }}
              >
                Add Report
              </Button>
            </View>
          </View>
          <View style={dps.view9}>
            {repor.length > 0 ? (
              <RenderPatientTable
                report={repor}
                theme={theme}
                navigation={navigation}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                }}
              >
                <Text>No Records Founds</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            marginLeft: 22,
            marginRight: 22,
            padding: 32,
          }}
        >
          <Text
            style={{
              fontSize: 19,
              color: theme.colors.secondary,
              fontFamily: "Inter-Medium",
            }}
          >
            Patient Details
          </Text>
          <View style={dps.view11}>
            <Text style={dps.text8}>Name</Text>
            <Text style={dps.text9}>{pData.fname + " " + pData.lname}</Text>
          </View>
          <View style={dps.view11}>
            <Text style={dps.text8}>Gender</Text>
            <Text style={dps.text9}>{pData.gender}</Text>
          </View>
          <View style={dps.view11}>
            <Text style={dps.text8}>Birth Date</Text>
            <Text style={dps.text9}>{pData.birth_date}</Text>
          </View>
          <View style={dps.view11}>
            <Text style={dps.text8}>Height</Text>
            <Text style={dps.text9}>{pData.height}cm</Text>
          </View>
          <View style={dps.view11}>
            <Text style={dps.text8}>Weight</Text>
            <Text style={dps.text9}>{pData.weight}kg</Text>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default DoctorPatientProfileScreen;
