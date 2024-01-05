import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import moment from "moment";
import { API_URL } from "./helper/common";

const Analysis = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [collectionListing, setCollectionListing] = useState([]);
  const [BoxValue, setBoxValue] = useState("");
  const [userId, setUserId] = useState("");
  const [collectionPaientListing, setCollectionPaitedntListing] = useState([]);
  const [CollectionLensListing, setCollectionLensListing] = useState([]);
  const [lenseListing, SetLenseListing] = useState([]);
  const [filteredLens, setFilteredLens] = useState([]);
  const [selectedPatientId, SetSelectedPatientId] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState("");
  const [validation, setValidation] = useState({});
  const [WC, SetWC] = useState();
  const [WS, SetWS] = useState();
  const [WA, SetWA] = useState();
  const [WB, SetWB] = useState();
  const [WMR, SetWMR] = useState();
  const [WML, SetWML] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [showblockLensModal, setShowBlockLensModal] = useState(false);
  const [showBlockedLensModel, setShowBlockedLensModel] = useState(false);
  const [activeLensId, SetActiveLensId] = useState("");
  const [activePatientId, setActivePatientId] = useState("");
  const [activePatientName, setActivePatientName] = useState("");
  const [filterPatientName, setFilterPatientName] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [eyewearConfig, setEyeWearConfig] = useState({
    RSphMult: "",
    LSphMult: "",
    RCylMult: "",
    LCylMult: "",
    RAxisMult: "",
    LAxisMult: "",
    RAddMult: "",
    LAddMult: "",
    RSphEqMult: "",
    LSphEqMult: "",
  });

  const [pointer, setPointer] = useState(0);

  // const setdataForPatient = async (value) => {
  // 	const response = await fetch(`${API_URL}/v1/filterpatientById?id=${value}`, {
  // 		method: "GET",
  // 		headers: {
  // 			"Content-Type": "application/json",
  // 			'Authorization': JSON.parse(localStorage.getItem('token'))
  // 		}

  // 	});
  // 	if (response.ok) {
  // 		const data = await response.json();
  // 		setFilteredLens(data.Patient_Data);
  // 	} else {
  // 		console.log('Get Failed');
  // 	}
  // }

  const loadData = async () => {
    const checkuserId = JSON.parse(localStorage.getItem("userId"));
    if (checkuserId) {
      await getdata();
      await getpatientData();
      await getLensdata();
      await getConfigurationData();

      if (checkuserId) {
        setUserId(checkuserId);
        if (id) {
          setCurrentPatientId(id);
          // handleInputChange(id)
          if (currentPatientId && CollectionLensListing.length > 0) {
            handleLensAlgorithm("", CollectionLensListing);
          }
        }
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (pointer < 5) {
      loadData();
      setPointer(pointer + 1);
    }
    // if (userId) {
    //   getdata();
    //   getpatientData();
    //   getLensdata();
    //   getConfigurationData();
    // }
  }, [userId, CollectionLensListing]);

  // useEffect(() => {

  //   // getAlgoData();
  //   const userId = JSON.parse(localStorage.getItem("userId"));
  //   if (userId) {
  //     setUserId(userId);
  //     if (id) {
  //       setCurrentPatientId(id);
  //       if (currentPatientId && CollectionLensListing.length > 0) {
  //         handleLensAlgorithm('', CollectionLensListing);
  //       }
  //     }
  //   }
  //   else {
  //     navigate('/')
  //   }

  // }, [id,currentPatientId, CollectionLensListing,userId]);

  const getConfigurationData = async () => {
    if (userId) {
      const getResponse = await fetch(`${API_URL}/v1/config?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log(data);

        // const eyewear = data.eyeWearConfig.map(element => ({
        //   [element.Parameters]: element.CurrentValue
        // }))
        const eyewear = data.eyeWearConfig.reduce((acc, element) => {
          acc[element.Parameters] = element.CurrentValue;
          return acc;
        }, {});
        setEyeWearConfig(eyewear);
        // setAxisConfig(data.axisConfig);
        console.log("datadata data", data);
      } else {
        console.log("Get Failed");
      }
    }
  };
  // const getAlgoData = async () => {
  //   const response = await fetch(`${API_URL}/v1/algoData`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: JSON.parse(localStorage.getItem("token")),
  //     },
  //   });
  //   const data = await response.json();
  //   // console.log('data',data);
  //   if (data && data.algoData && data.algoData.length > 0) {
  //     SetWC(data.algoData[0].WC);
  //     SetWS(data.algoData[0].WS);
  //     SetWA(data.algoData[0].WA);
  //     SetWB(data.algoData[0].WB);
  //     SetWMR(data.algoData[0].WMR);
  //     SetWML(data.algoData[0].WML);
  //   }
  // };

  const handleBoxValue = (e) => {
    const selectedBoxName = e.target.value;
    setBoxValue(selectedBoxName);
  };
  // const handlePatientName = (e) => {
  // 	SetSelectedPatientId(e.target.value);
  // }

  const getAMDValue = (CYL) => {
    let value = parseFloat(CYL);
    switch (value) {
      case value > 0:
        return 0;
        break;
      case value > -0.5 && value <= 0:
        return 25;
        break;
      case value > -1.0 && value <= -0.5:
        return 20;
        break;
      case value > -2.0 && value <= -1:
        return 10;
        break;
      case value > -3.0 && value <= -2:
        return 5;
        break;
      case value > -5.0 && value <= -3:
        return 4;
        break;
      default:
        return 0;
    }
  };

  //   const handleFilter = () => {
  //     if (!CollectionLensListing && CollectionLensListing.length === 0) return;
  //     if (!selectedPatientId) return;
  //     if (!validateForm()) {
  //       SetLenseListing([]);
  //       //const selectedBox = collectionListing.find((x) => x.Box_Name === BoxValue);
  //       let selectedBoxLens = CollectionLensListing;
  //       // const selectedBoxLens = CollectionLensListing.filter((x) => x.Box_Name == BoxValue)
  //       // if (selectedBoxLens) {
  //       // 	SetLenseListing(selectedBoxLens);
  //       // } else {
  //       // 	SetLenseListing([]);
  //       // }

  //       let getPatientData = collectionPaientListing.find(
  //         (x) => x.id === selectedPatientId
  //       );

  //       if (!getPatientData) return;
  //       // patient inputs as per documents
  //       let patientRCYL = getPatientData.RCylinder;
  //       let patientLCYL = getPatientData.LCylinder;
  //       let patientRSPH = getPatientData.RSphere;
  //       let patientLSPH = getPatientData.LSphere;
  //       let patientRAXIS = getPatientData.RAxis;
  //       let patientLAXIS = getPatientData.LAxis;
  //       let patientRBIF = getPatientData.LBIF;
  //       let patientLBIF = getPatientData.RBIF;
  //       console.log("getPatientData", getPatientData);

  //       console.log("selectedBoxLens", selectedBoxLens);

  //       if (selectedBoxLens && selectedBoxLens.length > 0) {
  //         selectedBoxLens.map((x, i) => {
  //           // Search Algorithm Calculated Values

  //           let LCE = x.LCylinder;
  //           let RCE = x.RCylinder;
  //           let LSE = x.LSphere;
  //           let RSE = x.RSphere;
  //           let LAE = x.LAxis;
  //           let RAE = x.RAxis;
  //           let LBE = x.LLBIF;
  //           let RBE = x.LRBIF;

  //           let LCD = Math.abs(patientLCYL - LCE);
  //           let LCDR = Math.abs(LCD / patientLCYL);
  //           let RCD = Math.abs(patientRCYL - RCE);
  //           let RCDR = Math.abs(RCD / patientRCYL);

  //           let LSD = Math.abs(patientLSPH - LSE);
  //           let LSDR = Math.abs(LSD / patientLSPH);
  //           let RSD = Math.abs(patientRSPH - RSE);
  //           let RSDR = Math.abs(RSD / patientRSPH);

  //           let LAD = Math.abs(patientLAXIS - LAE);
  //           let RAD = Math.abs(patientRAXIS - RAE);

  //           let LAMD = getAMDValue(patientLCYL);
  //           let RAMD = getAMDValue(patientRCYL);
  //           let LADR = LAD / LAMD;
  //           let RADR = RAD / RAMD;

  //           let LBD = Math.abs(patientLBIF - LBE);
  //           let LBDR = Math.abs(LBD / patientLBIF);
  //           let RBD = Math.abs(patientRBIF - RBE);
  //           let RBDR = Math.abs(RBD / patientRBIF);

  //           let MR = 100 - WC * RCDR - WS * RSDR - WA * RADR - WB * RBDR;
  //           let ML = 100 - WC * LCDR - WS * LSDR - WA * LADR - WB * LBDR;

  //           let M = WMR * MR + WML * ML;

  //           let MRS = 100 - WC * RCDR - WS * RSDR - WA * RADR;
  //           let MLS = 100 - WC * LCDR - WS * LSDR - WA * LADR;

  //           // let MS = (WMR * MRS ) + ( WML * MLS )

  //           let RSEQ = patientRSPH + 0.5 * RCE;
  //           let LSEQ = patientLSPH + 0.5 * LCE;

  //           selectedBoxLens[i].PatientName =
  //             getPatientData.firstName + " " + getPatientData.lastName;
  //           selectedBoxLens[i].lensId = x.lensId;
  //           selectedBoxLens[i].LCD = LCD;
  //           selectedBoxLens[i].LCDR = LCDR;
  //           selectedBoxLens[i].RCD = RCD;
  //           selectedBoxLens[i].RCDR = RCDR;
  //           selectedBoxLens[i].LSD = LSD;
  //           selectedBoxLens[i].LSDR = LSDR;
  //           selectedBoxLens[i].RSD = RSD;
  //           selectedBoxLens[i].RSDR = RSDR;
  //           selectedBoxLens[i].LAD = LAD;
  //           selectedBoxLens[i].RAD = RAD;
  //           selectedBoxLens[i].LAMD = LAMD;
  //           selectedBoxLens[i].RAMD = RAMD;

  //           selectedBoxLens[i].LADR = LADR;
  //           selectedBoxLens[i].RADR = RADR;
  //           selectedBoxLens[i].LBD = LBD;
  //           selectedBoxLens[i].LBDR = LBDR;
  //           selectedBoxLens[i].RBD = RBD;
  //           selectedBoxLens[i].RBDR = RBDR;
  //           selectedBoxLens[i].MR = MR;
  //           selectedBoxLens[i].ML = ML;
  //           selectedBoxLens[i].M = M;
  //           selectedBoxLens[i].MRS = MRS;
  //           selectedBoxLens[i].MLS = MLS;
  //           selectedBoxLens[i].RSEQ = RSEQ;
  //           selectedBoxLens[i].LSEQ = LSEQ;
  //         });
  //         console.log("SetLenseListing(selectedBoxLens);", selectedBoxLens);
  //         // Assuming selectedBoxLens is an array of objects with 'booked' and 'blocked' properties
  //         let filteredLens = selectedBoxLens.filter(
  //           (lens) => !lens.Is_Blocked && !lens.Is_Booked
  //         );
  //         // filteredLens.push(collectionPaientListing);

  //         //filteredLens.push(collectionObject);
  //         let newArray = [collectionPaientListing[0], ...filteredLens];
  //         console.log(newArray);
  //         // Now you can use the filteredLens array as needed
  //         SetLenseListing(newArray);

  //         // SetLenseListing(selectedBoxLens);
  //       }
  //     }
  //   };

  const getLensdata = async (matched) => {
    if (userId) {
      const queryParams = new URLSearchParams().toString();
      const getResponse = await fetch(
        `${API_URL}/v1/lens?${queryParams}&match=${matched}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (getResponse.ok) {
        const data = await getResponse.json();
        setCollectionLensListing(data.Lenses_Data);
        handleLensAlgorithm(data.Lenses_Data);
      } else {
        console.log("Get Failed");
      }
    }
  };

  const handleLensAlgorithm = async (
    lensData = CollectionLensListing,
    patientId = currentPatientId
  ) => {
    console.log("lensData", lensData);
    console.log("currentPatientId", patientId);
    console.log("eyewearConfig", eyewearConfig);

    if (!patientId) return;
    let analysedData = [];

    let patient = collectionPaientListing.find(
      (x) => x.PatientId === patientId
    );

    if (patient && lensData && lensData.length > 0 && eyewearConfig) {
      const parseToFloat = (value) => {
        const floatValue = parseFloat(value);
        return isNaN(floatValue) ? value : floatValue;
      };

      //configration
      const RSphMult = parseToFloat(eyewearConfig.RSphMult);
      const LSphMult = parseToFloat(eyewearConfig.LSphMult);
      const RCylMult = parseToFloat(eyewearConfig.RCylMult);
      const LCylMult = parseToFloat(eyewearConfig.LCylMult);
      const RAxisMult = parseToFloat(eyewearConfig.RAxisMult);
      const LAxisMult = parseToFloat(eyewearConfig.LAxisMult);
      const RAddMult = parseToFloat(eyewearConfig.RAddMult);
      const LAddMult = parseToFloat(eyewearConfig.LAddMult);
      const RSphEqMult = parseToFloat(eyewearConfig.RSphEqMult);
      const LSphEqMult = parseToFloat(eyewearConfig.LSphEqMult);

      //patient input values for example
      const RSphPat = parseToFloat(patient.RSphere);
      const LSphPat = parseToFloat(patient.LCylinder);
      const RCylPat = parseToFloat(patient.RCylinder);
      const LCylPat = parseToFloat(patient.LCylinder);
      const RAxisPat = parseToFloat(patient.RAxis);
      const LAxisPat = parseToFloat(patient.LAxis);
      const RAddPat = parseToFloat(patient.RAdd);
      const LAddPat = parseToFloat(patient.LAdd);

      for (let lens of lensData) {
        // Yellow part
        let RSphEqPat = RSphPat + RCylPat / 2;
        let LSphEqPat = LSphPat + LCylPat / 2;

        //green part
        let {
          RSphere: RSphE,
          RCylinder: LSphE,
          RCylinder: RCylE,
          LCylinder: LCylE,
          RAxis: RAxisE,
          LAxis: LAxisE,
          RAdd: RAddE,
          LAdd: LAddE,
        } = lens;

        // Modify the original object with parsed values
        RSphE = parseToFloat(RSphE);
        LSphE = parseToFloat(LSphE);
        RCylE = parseToFloat(RCylE);
        LCylE = parseToFloat(LCylE);
        RAxisE = parseToFloat(RAxisE);
        LAxisE = parseToFloat(LAxisE);
        RAddE = parseToFloat(RAddE);
        LAddE = parseToFloat(LAddE);

        let RSphEqE = RSphE + RCylE / 2;
        let LSphEqE = LSphE + LCylE / 2;

        let RSphDif = Math.abs(RSphEqPat - RSphEqE);
        let LSphDif = Math.abs(LSphEqPat - LSphEqE);

        let RSphDifR = Math.abs((RSphDif - RSphPat) / RSphPat);
        let LSphDifR = Math.abs((LSphDif - LSphPat) / LSphPat);

        let RSphFactor = RSphDif * RSphMult;
        let LSphFactor = LSphDif * LSphMult;

        //purple color
        let RCylDif = Math.abs(RCylE - RCylPat);
        let LCylDif = Math.abs(LCylE - LCylPat);

        let RCylDifR = Math.abs((RCylDif - RCylPat) / RCylPat);
        let LCylDifR = Math.abs((LCylDif - LCylPat) / LCylPat);

        let RCylFactor = RCylDif * RCylMult;
        let LCylFactor = LCylDif * LCylMult;

        //pink color
        let RAxisMinDif = axisMin(RCylPat);
        let LAxisMinDif = axisMin(LCylPat);

        let RAxisMaxDif = axisMax(RCylPat);
        let LAxisMaxDif = axisMax(LCylPat);

        let RAxisDif = Math.abs(RAxisE - RAxisPat);
        let LAxisDif = Math.abs(LAxisE - LAxisPat);

        let RAxisRatio =
          ((RAxisDif - RAxisMinDif) / (RAxisMaxDif - RAxisMinDif)) * RAxisDif;
        let LAxisRatio =
          ((LAxisDif - LAxisMinDif) / (LAxisMaxDif - LAxisMinDif)) * LAxisDif;

        let RAxisFactor;
        let LAxisFactor;

        if (RAxisDif <= RAxisMinDif) {
          RAxisFactor = 0;
        } else if (RAxisMinDif < RAxisDif && RAxisDif < RAxisMaxDif) {
          RAxisFactor = RAxisRatio * RAxisMult;
        } else if (RAxisDif > RAxisMaxDif) {
          RAxisFactor = RAxisMaxDif;
        }

        if (LAxisDif < LAxisMinDif) {
          LAxisFactor = 0;
        } else if (LAxisMinDif < LAxisDif && LAxisDif < LAxisMaxDif) {
          LAxisFactor = LAxisRatio * LAxisMult;
        } else if (LAxisDif > LAxisMaxDif) {
          LAxisFactor = LAxisMaxDif;
        }

        // yellow highlighter
        let RAddDif = Math.abs(RAddE - LAddPat);
        let LAddDif = Math.abs(LAddE - LAddPat);

        let RAddDifR = Math.abs((RAddDif - RAddPat) / RAddPat);
        let LAddDifR = Math.abs((LAddDif - LAddPat) / LAddPat);

        let RAddFactor = RAddDif * RAddMult;
        let LAddFactor = LAddDif * LAddMult; //RAddDif & LAddDif missing

        //purple color
        let RSphEqDif = Math.abs(RSphEqE - RSphEqPat);
        let LSphEqDif = Math.abs(LSphEqE - LSphEqPat);

        let RSphEqDifR = Math.abs((RSphEqDif - RSphEqPat) / RSphEqPat);
        let LSphEqDifR = Math.abs((LSphEqDif - LSphEqPat) / LSphEqPat);

        let RSphEqFactor = RSphEqDif * RSphEqMult;
        let LSphEqFactor = LSphEqDif * LSphEqMult;

        //Main percentage calculation
        let RMatchPercentageS = 100 - RSphFactor - RCylFactor - RAxisFactor;
        let LMatchPercentageS = 100 - LSphFactor - LCylFactor - LAxisFactor;

        let MatchPercentageS = (
          (RMatchPercentageS + LMatchPercentageS) /
          2
        ).toFixed(2);

        let RMatchPercentageB =
          100 - RSphFactor - RCylFactor - RAxisFactor - RAddFactor;
        let LMatchPercentageB =
          100 - LSphFactor - LCylFactor - LAxisFactor - LAddFactor;

        let MatchPercentageB = (
          (RMatchPercentageB + LMatchPercentageB) /
          2
        ).toFixed(2);

        //newly added

        let RAxisEqPat = RSphPat + RCylPat / 2;
        let LAxisEqPat = LSphPat + LCylPat / 2;

        let RAxisEqE = RSphE + RCylE / 2;
        let LAxisEqE = LSphE + LCylE / 2;

        let RAxisEqDif = Math.abs(RAxisEqE - RAxisEqPat);
        let LAxisEqDif = Math.abs(LAxisEqE - LAxisEqPat);

        let RAxisEqFactor = RAxisEqDif * RSphEqMult;
        let LAxisEqFactor = LAxisEqDif * LSphEqMult;

        let RCylEqDif = Math.abs(RSphEqE - RSphEqPat);
        let LCylEqDif = Math.abs(LSphEqE - LSphEqPat);

        let RCylEqFactor = RCylEqDif * RSphEqMult;
        let LCylEqFactor = LCylEqDif * LSphEqMult;

        let RMatchPercentageEqS =
          100 - RSphEqFactor - RCylEqFactor - RAxisEqFactor;
        let LMatchPercentageEqS =
          100 - LSphEqFactor - LCylEqFactor - LAxisEqFactor;

        let MatchPercentageEqS =
          (RMatchPercentageEqS + LMatchPercentageEqS) / 2;

        const lensData = {
          ...lens,
          MatchPercentageS: parseFloat(MatchPercentageS), // Convert back to numeric value
          MatchPercentageB: parseFloat(MatchPercentageB), // Convert back to numeric value
          MatchPercentageEqS: parseFloat(MatchPercentageEqS), // Convert back to numeric value
        };

        analysedData = [...analysedData, lensData];
      }

      const newLensList = analysedData.filter(
        (x) => !x.Patient_id || x.Patient_id == patientId
      );

      newLensList.sort(
        (a, b) =>
          b.MatchPercentageB - a.MatchPercentageB &&
          b.MatchPercentageS - a.MatchPercentageS
      );
      const newPat = id
        ? collectionPaientListing.filter((x) => x.PatientId === id)
        : collectionPaientListing.filter((x) => x.PatientId === patientId);
      const newPatient = {
        ...newPat[0],
        MatchPercentageB: 100,
        MatchPercentageS: 100,
        MatchPercentageEqS: 100,
      };
      // const newArray = [newPatient, ...newLensList];
      // SetLenseListing(newArray);
      const newArray = [newPatient];
      const newLensListData = [...newLensList];
      const selectedLenseStatus = newLensListData.filter(
        (x) => x.Lens_Status === "available"
      );
      const mergedArray = [...newArray, ...selectedLenseStatus];
      SetLenseListing(mergedArray);
    }
  };

  const axisMax = (CylPat) => {
    let value = 0;
    switch (CylPat) {
      case -0.5 <= CylPat <= 0.0:
        value = 30;
        break;

      case -1.0 <= CylPat < -0.5:
        value = 24;
        break;

      case -2.0 <= CylPat < -1.0:
        value = 16;
        break;

      case -3.0 <= CylPat < -2.0:
        value = 12;
        break;

      case -5.0 <= CylPat < -3.0:
        value = 8;
        break;

      default:
        break;
    }

    return value;
  };

  const axisMin = (CylPat) => {
    let value = 0;
    switch (CylPat) {
      case -0.5 <= CylPat <= 0.0:
        value = 7;
        break;

      case -1.0 <= CylPat < -0.5:
        value = 6;
        break;

      case -2.0 <= CylPat < -1.0:
        value = 4;
        break;

      case -3.0 <= CylPat < -2.0:
        value = 3;
        break;

      case -5.0 <= CylPat < -3.0:
        value = 2;
        break;

      default:
        break;
    }

    return value;
  };

  const getpatientData = async () => {
    if (userId) {
      const getResponse = await fetch(
        `${API_URL}/v1/patient?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (getResponse.ok) {
        const data = await getResponse.json();

        if (id) {
          SetSelectedPatientId(
            data.Patient_Data.find((x) => x.PatientId === id).id
          );
          //setCollectionPaitedntListing(data.Patient_Data.filter((x) => x.PatientId === id));
        }
        setCollectionPaitedntListing(data.Patient_Data);
      } else {
        console.log("Get Failed");
      }
    }
  };
  const getdata = async () => {
    if (userId) {
      const getResponse = await fetch(`${API_URL}/v1/box?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });
      if (getResponse.ok) {
        const data = await getResponse.json();
        setCollectionListing(data.Boxes_Data);
      } else {
        console.log("Get Failed");
      }
    }
  };

  const validateForm = () => {
    let isError = false;
    let error = {};
    if (!selectedPatientId) {
      error.selectedPatientId = "Required !";
      isError = true;
    }
    if (!WC) {
      error.WC = "Required !";
      isError = true;
    }
    if (!WS) {
      error.WS = "Required !";
      isError = true;
    }
    if (!WA) {
      error.WA = "Required !";
      isError = true;
    }
    if (!WB) {
      error.WB = "Required !";
      isError = true;
    }
    if (!WMR) {
      error.WMR = "Required !";
      isError = true;
    }
    if (!WML) {
      error.WML = "Required !";
      isError = true;
    }
    setValidation(error);
    return isError;
  };

  const handleInputChange = async (e) => {
    setCurrentPatientId(e.target.value);
    //SetSelectedPatientId(e.target.value)
    const response = await fetch(
      `${API_URL}/v1/filterpatientById?id=${e.target.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // setFilteredLens(data.Patient_Data);
      SetLenseListing(data.Patient_Data);
      handleLensAlgorithm(
        CollectionLensListing,
        data.Patient_Data[0]?.PatientId ? data.Patient_Data[0]?.PatientId : ""
      );
    } else {
      console.log("Get Failed");
    }
  };

  const handleFiltedId = (selectedPatientRow) => {
    setCurrentPatientId(
      filteredLens.find((x) => x.id == selectedPatientRow.id).PatientId
    );
    SetSelectedPatientId(selectedPatientRow.id);
    setFilteredLens([]);
  };

  const dispenseLens = async (e, id) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: id,
      dispense: true,
      Patient_id: selectedPatientId,
    };
    await updateLens(info);
  };

  const returnLense = async (e, id) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: id,
      returned: true,
      Patient_id: selectedPatientId,
    };
    await updateLens(info);
  };

  const openBlockedModal = (lensId, booked) => {
    if (!booked) {
      setShowBlockedLensModel(true);
      SetActiveLensId(lensId);
    }
  };

  const closeBlockLensModel = () => {
    setShowBlockLensModal(false);
    setPatientData([]);
    setActivePatientName("");
    setShowBlockedLensModel(false);
  };

  // const openBlockLensModal = (lensId) => {
  // 	setShowBlockLensModal(true)
  // 	SetActiveLensId(lensId)
  // }

  // const changeBlockLensHandle = async (e) => {
  // 	//setActivePatientId(e.target.value);
  // 	if (e.target.name == 'filterPatient') {
  // 		setFilterPatientName(e.target.value);
  // 	}
  // 	else {
  // 		setActivePatientName(e.target.value);
  // 	}
  // 	if (e.target.value != '') {
  // 		const getResponse = await fetch(`${API_URL}/v1/patientByName?name=${e.target.value}&userId=${userId}`, {
  // 			method: "GET",
  // 			headers: {
  // 				"Content-Type": "application/json",
  // 				'Authorization': JSON.parse(localStorage.getItem('token'))
  // 			}
  // 		});
  // 		if (getResponse.ok) {
  // 			const data = await getResponse.json();
  // 			console.log(data.Patient_Data);
  // 			setPatientData(data.Patient_Data);
  // 		} else {
  // 			console.log('Get Failed');
  // 		}

  // 	}

  // }

  // const selectPatient = async (patientId, patientName, filtering) => {
  // 	if (filtering != '') {
  // 		setFilterPatientName(patientName)

  // 		// bind all modal form using patientId
  // 		const response = await fetch(`${API_URL}/v1/patientById?id=${patientId}`, {
  // 			method: 'GET',
  // 			headers: {
  // 				'Content-Type': 'application/json',
  // 				'Authorization': JSON.parse(localStorage.getItem('token'))
  // 			},
  // 		});
  // 		if (response.ok) {
  // 			const data = await response.json();
  // 			// setNewBoxModel({
  // 			//   ...data.Patient_Data,
  // 			//   Patient_id: data.Patient_Data.id
  // 			// })
  // 			// setBoxModel({
  // 			//   ...data.Patient_Data,
  // 			//   Patient_id: data.Patient_Data.id
  // 			// });
  // 		} else {
  // 			console.log('Lens not Blocked');
  // 		}

  // 	}
  // 	else {
  // 		setActivePatientName(patientName);
  // 	}
  // 	setActivePatientId(patientId);
  // 	setPatientData([]);
  // }

  const submitBlockLensModal = async (e, activeLensId) => {
    e.preventDefault();
    if (selectedPatientId) {
      const info = {
        patient_id: selectedPatientId,
        lens_id: activeLensId,
      };
      const response = await fetch(`${API_URL}/v1/block`, {
        method: "PUT",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });
      if (response.ok) {
        console.log("Lens Blocked Successfully");
        await getLensdata();
      } else {
        console.log("Lens not Blocked");
      }
      setShowBlockLensModal(false);
      setActivePatientId("");
      SetActiveLensId("");
      setActivePatientName("");
    }
  };

  const bookLens = async (e) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: activeLensId,
      Is_Booked: true,
    };
    await updateLens(info);
    setShowBlockedLensModel(false);
    SetActiveLensId("");
  };

  const releaseLense = async (e) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: activeLensId,
      Is_Blocked: false,
      Patient_id: "",
    };
    await updateLens(info);
    setShowBlockedLensModel(false);
    SetActiveLensId("");
  };

  const updateLens = async (info) => {
    const response = await fetch(`${API_URL}/v1/lens`, {
      method: "PUT",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    if (response.ok) {
      await getLensdata();
    } else {
      console.log("Lens not Blocked");
    }
  };

  // useEffect(() => {
  //   // handleFilter();
  // }, [CollectionLensListing]);

  const handleStatusChange = async (e, selectedRow) => {
    const selectedStatus = e.target.value;
    selectedRow.Lens_Status = selectedStatus;
    selectedRow.Patient_id = currentPatientId;

    const response = await fetch(`${API_URL}/v1/lens`, {
      method: "PUT",
      body: JSON.stringify(selectedRow),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    if (response.ok) {
      console.log("Lens Blocked Successfully");
      //   getdata(false);
      //handleFilter();
      await getLensdata();
    } else {
      console.log("Lens not Blocked");
    }
  };

  console.log("lenseListing", lenseListing);
  return (
    <>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
        <div className="user_style">
          <div className="user_name">
            <h2>Lenses</h2>
            <hr className="mt-4" />
          </div>
          {/* <div className="row search_input">
            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="form-floating mb-0">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Patient Id"
                  name="patientId"
                  value={currentPatientId}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <label htmlFor="selectBoxDate">Patient Id</label>
                <span className="text-danger">
                  {validation.selectedPatientId}
                </span>
                <div className="filter_sugestions">
                  {filteredLens &&
                    filteredLens.map((x) => {
                      return (
                        <>
                          <span
                            className="d-block"
                            onClick={() => handleFiltedId(x)}
                          >
                            {x.PatientId}
                          </span>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-12 col-12 mt-lg-0 mt-md-0 mt-4">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={(e) => {
                  handleLensAlgorithm(e);
                }}
              >
                <span>Filter</span>
              </button>
              <button className="btn btn-primary w-100" onClick={handleFilter}>
                <span>Filter</span>
              </button>
            </div>
          </div> */}

          <div className="row search_input">
            <div className="col-lg-2">
              <div className="form-floating mb-3"></div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
            <div
                className="table_card search_table analysis_table rounded pt-0"
              >
                <table className="table">
                  <thead className="rounded">
                    <tr>
                      <th colSpan={4} className="text-center">
                        EyeWare
                      </th>
                      <th colSpan={4} className="text-center">
                        Right Lens
                      </th>
                      <th colSpan={4} className="text-center">
                        Left Lens
                      </th>
                      <th colSpan={3} className="text-center"></th>
                    </tr>
                    <tr>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Id
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        %S
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        %Bi
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        EqS
                      </th>

                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Sphere
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Cylinder
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Axis
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Add
                      </th>

                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Sphere
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Cylinder
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Axis
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Add
                      </th>

                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Status
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Date
                      </th>
                      <th className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {lenseListing &&
                      lenseListing.length > 0 ?
                      lenseListing.map((x, index) => {
                        return (
                          <tr key={x.index} className="data">
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {/* { id ? 
                              {index === 0 ? <input
                               type="text"
                               value={x.PatientId}
                               onChange={(e) => {
                               handleInputChange(e);
                              }}
                             /> : x.lensId}
                                 :
                             {index === 0 ? x.patientId
                             : x.lensId}} */}

                              {
                                id ? (
                                  index === 0 ? x.PatientId : x.lensId

                                ) : (
                                  index === 0 ? (
                                    <input
                                      type="text"
                                      value={x.PatientId}
                                      onChange={(e) => handleInputChange(e)}
                                    />
                                  ) : (
                                    x.lensId
                                  )
                                )
                              }
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {index === 0 ? "100" : x.MatchPercentageB}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {index === 0 ? "100" : x.MatchPercentageS}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {index === 0
                                ? "100"
                                : x.MatchPercentageEqS.toFixed(2)}
                            </td>

                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.RSphere}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.RCylinder}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.RAxis}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.RAdd}
                            </td>

                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.LSphere}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.LCylinder}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.LAxis}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {x.LAdd}
                            </td>

                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {index === 0 ? (
                                "patient"
                              ) : (
                                //	dispensed, Missing, Trashed
                                // <select>
                                //   <option value="selected">Selected</option>
                                //   <option value="available">Available</option>
                                //   <option value="dispensed">Dispensed</option>
                                //   <option value="missing">Missing</option>
                                //   <option value="trashed">Trashed</option>
                                // </select>
                                <select
                                  onChange={(e) => handleStatusChange(e, x)}
                                >
                                  <option value="">Select Status</option>
                                  <option
                                    value="selected"
                                    selected={x.Lens_Status === "selected"}
                                  >
                                    Selected
                                  </option>
                                  <option
                                    value="available"
                                    selected={x.Lens_Status === "available"}
                                  >
                                    Available
                                  </option>
                                  <option
                                    value="dispensed"
                                    selected={x.Lens_Status === "dispensed"}
                                  >
                                    Dispensed
                                  </option>
                                  <option
                                    value="missing"
                                    selected={x.Lens_Status === "missing"}
                                  >
                                    Missing
                                  </option>
                                  <option
                                    value="trashed"
                                    selected={x.Lens_Status === "trashed"}
                                  >
                                    Trashed
                                  </option>
                                </select>
                              )}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {moment(x.createdAt).format("YYYY-MM-DD")}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-3 px-3 "
                                  : "data py-3 px-3 "
                              }
                            >
                              {moment(x.createdAt).format("hh:mm:ss")}
                            </td>
                          </tr>
                        );
                      }) : 
                      <tr>
                        <td>
                          <input
                            type="text"
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                          />
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showBlockedLensModel} onHide={closeBlockLensModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>Blocked lens</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Modal.Footer>
            <Button
              className="btn btn-primary bg-danger"
              variant="secondary"
              onClick={releaseLense}
            >
              Release
            </Button>
            <Button
              className="btn btn-primary bg-success"
              variant="primary"
              onClick={bookLens}
            >
              Book
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Analysis;
