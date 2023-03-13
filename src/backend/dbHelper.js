const API_URL =
  "http://ec2-15-207-51-129.ap-south-1.compute.amazonaws.com:3000/api/v1/";

export async function getRecordDataByRID(rid) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let res = await fetch(
      API_URL + "getRecordDataByRID?rid=" + rid,
      requestOptions
    );
    res = res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function getRecordsByPID(pid) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let res = await fetch(
      API_URL + "getRecordsDataByPID?pid=" + pid,
      requestOptions
    );
    res = res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function getRelationsByDID(did) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let res = await fetch(
      API_URL + "getRelationsByDID?did=" + did,
      requestOptions
    );
    res = await res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function getUserDatabyUID(uid) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let res = await fetch(API_URL + "getUserData?uid=" + uid, requestOptions);
    res = await res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function createRelation(did, pid) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
      did: did,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let res = await fetch(API_URL + "createRelation", requestOptions);
    res = res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function createRecord(did, pid, treat, med_arr) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      creator_uid: did,
      patient_uid: pid,
      treat: treat,
      med_arr: med_arr,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let res = await fetch(API_URL + "createBaseRecord", requestOptions);
    res = res.json();
    return res;
  } catch (e) {
    return e;
  }
}

export async function updateUserData(uid, fname, lname, initiated) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let obj = {
      uid: uid,
    };
    if (fname) {
      Object.assign(obj, { fname: fname });
    }
    if (lname) {
      Object.assign(obj, { lname: lname });
    }
    if (initiated) {
      Object.assign(obj, { initiated: initiated });
    }
    var raw = JSON.stringify(obj);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let res = await fetch(API_URL + "updateUserData", requestOptions);
    res = res.json();
    return res;
  } catch (e) {
    return e;
  }
}
