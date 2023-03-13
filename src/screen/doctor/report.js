import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import {
  useTheme,
  Appbar,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Text, View, ScrollView, Image, ToastAndroid } from "react-native";
import { doctorPatientReportStyle as drs } from "../../styles/land.style";
import reportData from "../../../assets/fakedata/reportData.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecordDataByRID, getUserDatabyUID } from "../../backend/dbHelper";

const assArt =
  "https://imgproxy-us-east-2-new.icons8.com/i54OYf6ih-ZFDbPUsqkuSwF53-x2_P4WlCZX_kUjAsE/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODA3/LzAxYzA0YTkwLTEx/NzMtNDllZS1iNWJm/LTYzMTYzYjJkNWNm/NC5zdmc.png";

const mediArr = [
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
  { name: "medicinename", quan: Math.floor(Math.random() * 10) },
];

export const RenderMedicineTable = ({ rep }) => {
  return (
    <View style={drs.view1}>
      <View style={drs.view2}>
        <Text style={drs.text1}>Name</Text>
        <Text style={drs.text1}>Quantity</Text>
      </View>
      {rep.med_arr.map((e, i) => {
        return (
          <View key={i} style={drs.view3}>
            <Text style={drs.text2}>{e}</Text>
            <Text style={drs.text3}>{Math.floor(Math.random() * 5) + 1}</Text>
          </View>
        );
      })}
    </View>
  );
};

const DoctorPatientReportScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const pram = route ? route.params : null;
  const [repr, setrepr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drData, setDrData] = useState(null);
  useLayoutEffect(() => {
    if (pram) {
      const run = async () => {
        const recordsDataRes = await getRecordDataByRID(pram.cid);
        console.log(recordsDataRes);
        if (!recordsDataRes.errorBool) {
          setrepr(recordsDataRes.response);
          const drdatares = await getUserDatabyUID(
            recordsDataRes.response.creator_uid
          );
          if (!drdatares.errorBool) setDrData(drdatares.response);
        } else {
          setrepr(null);
          ToastAndroid.show(recordsDataRes.errorMessage, ToastAndroid.SHORT);
          console.log(recordsDataRes.errorMessage);
        }
        setLoading(false);
      };
      run();
    }
  }, []);
  if (loading || !repr)
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Report" />
        </Appbar.Header>
        <SafeAreaView
          style={{
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
        <Appbar.Content title="Report" />
      </Appbar.Header>
      <ScrollView>
        <View
          style={{
            ...drs.view4,
            backgroundColor: theme.colors.background,
          }}
        >
          <Text style={{ ...drs.text4, color: theme.colors.secondary }}>
            Report Id
          </Text>
          <Text
            style={{
              color: theme.colors.onPrimaryContainer,
              ...drs.text6,
            }}
          >
            {repr.id}
          </Text>
          <Text
            style={{
              ...drs.text5,
              color: theme.colors.secondary,
            }}
          >
            Treatment for
          </Text>
          <Text
            style={{
              color: theme.colors.onPrimaryContainer,
              ...drs.text6,
            }}
          >
            {repr.treat_id}
          </Text>
          <Text
            style={{
              ...drs.text5,
              color: theme.colors.secondary,
            }}
          >
            Created On
          </Text>
          <Text
            style={{
              color: theme.colors.onPrimaryContainer,
              ...drs.text6,
            }}
          >
            {new Date(repr.created_at).toDateString()}
          </Text>
          <Text
            style={{
              ...drs.text5,
              color: theme.colors.secondary,
            }}
          >
            Treated By
          </Text>

          <Text
            style={{
              color: theme.colors.onPrimaryContainer,
              ...drs.text6,
            }}
          >
            {"Dr. " + drData.fname + " " + drData.lname}
          </Text>
          <Text
            style={{
              ...drs.text5,
              color: theme.colors.secondary,
            }}
          >
            Transaction Hash
          </Text>
          <Text
            style={{
              color: theme.colors.onPrimaryContainer,
              ...drs.text6,
            }}
          >
            {repr.txn_hash}
          </Text>

          <RenderMedicineTable rep={repr} />
          <Text
            style={{
              backgroundColor: theme.colors.secondaryContainer,
              padding: 12,
              marginTop: 12,
              borderRadius: 6,
              color: theme.colors.secondary,
              fontSize: 16,
              fontFamily: "Inter-Medium",
            }}
          >
            💡 Record is stored on blockchain
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            // top: 100,
            right: 0,
            width: 120,
            height: 120,
          }}
        >
          <Image
            source={{ uri: assArt }}
            style={{
              width: 80,
              height: 80,
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default DoctorPatientReportScreen;
