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

export async function getRecordFilebyCID(cid) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let res = await fetch(
      API_URL + "getRecordFileByCID?cid=" + cid,
      requestOptions
    );
    res = res.json();
    return res;
  } catch (e) {
    return e;
  }
}
export async function createRecord(did, pid, treat, med_arr, fileData) {
  try {
    console.log(did, pid, treat, med_arr, fileData);
    const formData = new FormData();
    if (fileData) {
      formData.append("fileData", fileData);
    }
    if (med_arr.length > 0) {
      let str = "";
      for (let i = 0; i < med_arr.length; i++) {
        str += med_arr[i];
        if (i != med_arr.length - 1) {
          str += ",";
        }
      }
      formData.append("med_arr", str);
    }
    formData.append("creator_uid", did);
    formData.append("patient_uid", pid);
    formData.append("treat", treat);
    var requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    let res = await fetch(API_URL + "createRecord", requestOptions);
    res = res.json();
    return res;
  } catch (e) {
    console.log("e==>" + e);
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
