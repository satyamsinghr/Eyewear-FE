import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import moment from "moment";
import { API_URL } from "./helper/common";
import { handleSignOut } from './utils/service';
const DispenseComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const patientInputRef = useRef();
  const [collectionListing, setCollectionListing] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(5);
  const [BoxValue, setBoxValue] = useState("");
  const [userId, setUserId] = useState("");
  const [collectionPaientListing, setCollectionPaitedntListing] = useState([]);
  const [CollectionLensListing, setCollectionLensListing] = useState([]);
  const [lenseListing, SetLenseListing] = useState([]);
  const [filteredLens, setFilteredLens] = useState([]);
  const [selectedPatientId, SetSelectedPatientId] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState("");
  const [PatientId, setPatientId] = useState("");
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
  const [role, setRole] = useState("");
  const [collId, setCollId] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [collName, setCollName] = useState('');
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

  useEffect(() => {
    // Focus the input element when the component mounts
    patientInputRef.current.focus();
  }, [lenseListing]);

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
    const role = JSON.parse(localStorage.getItem("role"));
    const collId = JSON.parse(localStorage.getItem("collId"));
    setRole(role);
    setCollId(collId);
    const lensCollectionId = localStorage.getItem("selectedLensCollectionId");
    setSelectedCollectionId(lensCollectionId);
    getCollectionData(lensCollectionId);
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

  const getCollectionData = async (lensCollectionId) => {
    const getResponse = await fetch(
      `${API_URL}/v1/collection?userId=${userId}`,
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
      const collectionData = data.Collection_Data.map((x) => ({
        ...x,
        Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
      }));
      const collName= collectionData.filter((x) =>x.id ==lensCollectionId );
      // setCollName(collName[0]?.Coll_name)
      setCollName(collName[0]?.Coll_name);
      setCollectionListing(collectionData);
    } else {
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Get Failed");
      }
    }
  };
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
        // const eyewear = data.eyeWearConfig.map(element => ({
        //   [element.Parameters]: element.CurrentValue
        // }))
        const eyewear = data.eyeWearConfig.reduce((acc, element) => {
          acc[element.Parameters] = element.CurrentValue;
          return acc;
        }, {});
        setEyeWearConfig(eyewear);
        // setAxisConfig(data.axisConfig);
      } else {
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        } else {
          console.log("Get Failed");
        }
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

  // const handlePageSizeChange = (e) => {
  //   setCurrentPage(1); // Reset to the first page when changing page size
  //   setItemsPerPage(parseInt(e.target.value, 10));
  // };

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
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        } else {
          console.log("Get Failed");
        }
      }
    }
  };

  const handleLensAlgorithm = async (
    lensData1 = CollectionLensListing,
    patientId = currentPatientId,
    filteredLens
  ) => {
    if (!patientId) return;
    let analysedData = [];
    lensData1 = lensData1.filter(
      (x) => x.Lens_Status === "selected" || x.Lens_Status === "dispensed"
    );
    // if (filteredLens && filteredLens.length > 0) {
    //   filteredLens = filteredLens.filter(
    //     (x) => x.Lens_Status === "selected" || x.Lens_Status === "dispensed"
    //   );
    //   // lensData1 = [...lensData1];
    //   lensData1 = [...filteredLens, ...lensData1];
    // }
    let patient = collectionPaientListing.find(
      (x) => x.PatientId === patientId
    );
    var lensData = [];
    if (patient && lensData1 && lensData1.length > 0 && eyewearConfig) {
      if (role == 1) {
        lensData = lensData1.filter((x) => x.CollectionId == patient.CollectionId);
    } else if (collId.includes(patient.CollectionId)) {
        lensData = lensData1.filter((x) => x.CollectionId == patient.CollectionId);
    }else{
      return false
    }
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
         RSphE = !isNaN(parseToFloat(RSphE)) ? parseToFloat(RSphE) : 0;
         LSphE = !isNaN(parseToFloat(LSphE)) ? parseToFloat(LSphE) : 0;
         RCylE = !isNaN(parseToFloat(RCylE)) ? parseToFloat(RCylE) : 0;
         LCylE = !isNaN(parseToFloat(LCylE)) ? parseToFloat(LCylE) : 0;
         RAxisE = !isNaN(parseToFloat(RAxisE)) ? parseToFloat(RAxisE) : 0;
         LAxisE = !isNaN(parseToFloat(LAxisE)) ? parseToFloat(LAxisE) : 0;
         RAddE = !isNaN(parseToFloat(RAddE)) ? parseToFloat(RAddE) : 0;
         LAddE = !isNaN(parseToFloat(LAddE)) ? parseToFloat(LAddE) : 0;

        let RSphEqE = RSphE + RCylE / 2;
        let LSphEqE = LSphE + LCylE / 2;

        let RSphDif = !isNaN(Math.abs(RSphEqPat - RSphEqE)) ? Math.abs(RSphEqPat - RSphEqE) : 0;
        let LSphDif = !isNaN(Math.abs(LSphEqPat - LSphEqE)) ? Math.abs(LSphEqPat - LSphEqE) : 0;

        let RSphDifR = !isNaN(Math.abs((RSphDif - RSphPat) / RSphPat)) ? Math.abs((RSphDif - RSphPat) / RSphPat) : 0;
        let LSphDifR = !isNaN(Math.abs((LSphDif - LSphPat) / LSphPat)) ? Math.abs((LSphDif - LSphPat) / LSphPat) : 0;

        let RSphFactor = RSphDif * RSphMult;
        let LSphFactor = LSphDif * LSphMult;

        //purple color
        let RCylDif = !isNaN(Math.abs(RCylE - RCylPat)) ? Math.abs(RCylE - RCylPat) : 0;
        let LCylDif = Math.abs(LCylE - LCylPat);

        let RCylDifR = !isNaN(Math.abs((RCylDif - RCylPat) / RCylPat)) ? Math.abs((RCylDif - RCylPat) / RCylPat) : 0;
        let LCylDifR = !isNaN(Math.abs((LCylDif - LCylPat) / LCylPat)) ? Math.abs((LCylDif - LCylPat) / LCylPat) : 0;

        let RCylFactor = RCylDif * RCylMult;
        let LCylFactor = LCylDif * LCylMult;

        //pink color
        let RAxisMinDif = axisMin(RCylPat);
        let LAxisMinDif = axisMin(LCylPat);

        let RAxisMaxDif = axisMax(RCylPat);
        let LAxisMaxDif = axisMax(LCylPat);

        let RAxisDif = !isNaN(Math.abs(RAxisE - RAxisPat)) ? Math.abs(RAxisE - RAxisPat) : 0;
        let LAxisDif = !isNaN(Math.abs(LAxisE - LAxisPat)) ? Math.abs(LAxisE - LAxisPat) : 0;

        let RAxisRatio =
          ((RAxisDif - RAxisMinDif) / (RAxisMaxDif - RAxisMinDif)) * RAxisDif;
        let LAxisRatio =
          ((LAxisDif - LAxisMinDif) / (LAxisMaxDif - LAxisMinDif)) * LAxisDif;
          if (isNaN(RAxisRatio) || !isFinite(RAxisRatio)) {
            RAxisRatio = 0;
          }
          if (isNaN(LAxisRatio) || !isFinite(LAxisRatio)) {
            LAxisRatio = 0;
          }
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
        let RAddDif = !isNaN(Math.abs(RAddE - LAddPat)) ? Math.abs(RAddE - LAddPat) : 0;
        let LAddDif = !isNaN(Math.abs(LAddE - LAddPat)) ? Math.abs(LAddE - LAddPat) : 0;

        let RAddDifR = !isNaN(Math.abs((RAddDif - RAddPat) / RAddPat)) ? Math.abs((RAddDif - RAddPat) / RAddPat) : 0;
        let LAddDifR = !isNaN(Math.abs((LAddDif - LAddPat) / LAddPat)) ? Math.abs((LAddDif - LAddPat) / LAddPat) : 0;

        let RAddFactor = RAddDif * RAddMult;
        let LAddFactor = LAddDif * LAddMult; //RAddDif & LAddDif missing

        //purple color
        let RSphEqDif = !isNaN(Math.abs(RSphEqE - RSphEqPat)) ? Math.abs(RSphEqE - RSphEqPat) : 0;
        let LSphEqDif = !isNaN(Math.abs(LSphEqE - LSphEqPat)) ? Math.abs(LSphEqE - LSphEqPat) : 0;

        let RSphEqDifR = !isNaN(Math.abs((RSphEqDif - RSphEqPat) / RSphEqPat)) ? Math.abs((RSphEqDif - RSphEqPat) / RSphEqPat) : 0;
        let LSphEqDifR = !isNaN(Math.abs((LSphEqDif - LSphEqPat) / LSphEqPat)) ? Math.abs((LSphEqDif - LSphEqPat) / LSphEqPat) : 0;

        let RSphEqFactor = RSphEqDif * RSphEqMult;
        let LSphEqFactor = LSphEqDif * LSphEqMult;

        if (LAxisFactor == undefined) {
          LAxisFactor = 0
        }
        if (RAxisFactor == undefined) {
          RAxisFactor = 0
        }
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

        let RAxisEqDif = !isNaN(Math.abs(RAxisEqE - RAxisEqPat)) ? Math.abs(RAxisEqE - RAxisEqPat) : 0;
        let LAxisEqDif = !isNaN(Math.abs(LAxisEqE - LAxisEqPat)) ? Math.abs(LAxisEqE - LAxisEqPat) : 0;

        let RAxisEqFactor = RAxisEqDif * RSphEqMult;
        let LAxisEqFactor = LAxisEqDif * LSphEqMult;

        let RCylEqDif = !isNaN(Math.abs(RSphEqE - RSphEqPat)) ? Math.abs(RSphEqE - RSphEqPat) : 0;
        let LCylEqDif = !isNaN(Math.abs(LSphEqE - LSphEqPat)) ? Math.abs(LSphEqE - LSphEqPat) : 0;

        let RCylEqFactor = RCylEqDif * RSphEqMult;
        let LCylEqFactor = LCylEqDif * LSphEqMult;

        let RMatchPercentageEqS =
          100 - RSphEqFactor - RCylEqFactor - RAxisEqFactor;
        let LMatchPercentageEqS =
          100 - LSphEqFactor - LCylEqFactor - LAxisEqFactor;

        let MatchPercentageEqS =
          ((RMatchPercentageEqS + LMatchPercentageEqS) / 2).toFixed(2);

        const lensData = {
          ...lens,
          MatchPercentageS: !isNaN(MatchPercentageS) ? parseFloat(MatchPercentageS) : 0,
          MatchPercentageB: !isNaN(MatchPercentageB) ? parseFloat(MatchPercentageB) : 0,
          MatchPercentageEqS: !isNaN(MatchPercentageEqS) ? parseFloat(MatchPercentageEqS) : 0,
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
      const newArray = [newPatient];
      const newLensListData = [...newLensList];
      const readingLenses = newLensListData
    .sort((a, b) => b.MatchPercentageS - a.MatchPercentageS)
      const mergedArray = [...newArray, ...readingLenses];
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
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        } else {
          console.log("Get Failed");
        }
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
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        } else {
          console.log("Get Failed");
        }
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
      const allLens = data.Patient_Data
      // SetLenseListing((prevList) => [allLens]);
      // SetLenseListing(data.Patient_Data);
      // handleLensAlgorithm(
      //   CollectionLensListing,
      //   data.Patient_Data[0]?.PatientId ? data.Patient_Data[0]?.PatientId : ""
      // );

      const res = await fetch(
        `${API_URL}/v1/selectedReaderFilter?patientId=${e.target.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (res.ok) {
        const data2 = await res.json();
        const filteredLens = data2.readers;
        SetLenseListing(filteredLens);
        handleLensAlgorithm(
          CollectionLensListing,
          data.Patient_Data[0]?.PatientId ? data.Patient_Data[0]?.PatientId : "",
          filteredLens
        );

      } else {
        console.log("Get Failed");
      }
    } else {
      console.log("Get Failed");
    }
  };

  // const handleFiltedId = (selectedPatientRow) => {
  //   setCurrentPatientId(
  //     filteredLens.find((x) => x.id == selectedPatientRow.id).PatientId
  //   );
  //   SetSelectedPatientId(selectedPatientRow.id);
  //   setFilteredLens([]);
  // };

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
    if (selectedStatus != "readingAvailable" && selectedStatus != "readingSelected") {
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
        handleLensAlgorithm();
      } else {
        console.log("Lens not Blocked");
      }
    }
    else {
      // currentPatientId
      const data = {
        patientId: currentPatientId,
        lensId: selectedRow.lensId,
      };
      const res = await fetch(`${API_URL}/v1/deleteSelectedReader`, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });
      if (res.ok) {
        console.log("Deletion successful");
        // getdata();
      } else {
        console.log("Deletion failed");
      }
    }
  };

  return (
    <>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
      <div className="user_style patient_header">
          <div className="row search_input">
            <div className="col-lg-2">
              <div className="form-floating mb-3"></div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card search_table analysis_table rounded pt-0">
                <table className="table">
                  <thead className="rounded">
                    <tr>
                      <th colSpan={4} className="text-center">
                        {/* EyeWare */}
                        {collName}
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
                        %EqS
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
                      lenseListing.map((x, id) => {
                        return (
                          <tr key={x.id} className="data">
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {id === 0 ?
                              <input
                                type="text"
                                ref={patientInputRef}
                                value={currentPatientId}
                                onChange={(e) => {
                                  handleInputChange(e);
                                }}
                              /> : x.lensId}

                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {/* {id === 0 ? "100" : x.MatchPercentageB} */}
                            {id === 0 ? "100" : x.MatchPercentageS}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {id === 0 ? "100" : x.MatchPercentageB}
                            {/* {id === 0 ? "100" : "ss"} */}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {id === 0
                              ? "100"
                              : x.MatchPercentageEqS}
                          </td>

                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.RSphere}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.RCylinder}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.RAxis}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.RAdd}
                          </td>

                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.LSphere}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.LCylinder}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.LAxis}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {x.LAdd}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {id === 0 ? (
                              "patient"
                            ) : (
                              <select
                                onChange={(e) => handleStatusChange(e, x)}
                              >
                                <option value="">Select Status</option>
                                {(x.Lens_Status === "selected" || x.Lens_Status === "dispensed") && (
                                  <>
                                    <option
                                      value="available"
                                      selected={x.Lens_Status === "available"}
                                    >
                                      Available
                                    </option>
                                    <option
                                      value="selected"
                                      selected={x.Lens_Status === "selected"}
                                    >
                                      Selected
                                    </option>
                                    <option
                                      value="dispensed"
                                      selected={x.Lens_Status === "dispensed"}
                                    >
                                      Dispensed
                                    </option>
                                    {/* <option
                                  value="reading"
                                  selected={x.Lens_Status === "reading"}
                                >
                                  Reading
                                </option> */}
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
                                  </>
                                )}
                                {x.Lens_Status === "reading" && (
                                  <>
                                    <option
                                      value="readingAvailable"
                                      selected={x.Lens_Status === "selected" || x.Lens_Status === "reading"}
                                    >
                                      Reading Available
                                    </option>
                                    <option
                                      value="readingSelected"
                                    >
                                      Reading Selected
                                    </option>
                                  </>
                                )}

                              </select>
                            )}
                          </td>

                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {moment(x.createdAt).format("YYYY-MM-DD")}
                          </td>
                          <td
                            className={
                              id === 0
                                ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                            }
                          >
                            {moment(x.createdAt).format("hh:mm:ss")}
                          </td>
                        </tr>
                        );
                      }) : <tr>
                        <td>
                          <input
                            type="text"
                            value={currentPatientId}
                            ref={patientInputRef}
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                          />
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td></td> */}
                      </tr>
                    }
                  </tbody>
                </table>
                {/* <div className="d-flex table_pagination mt-3 align-items-center justify-content-end gap-3">
                <ul className="pagination">
                  {pageNumbers.map((number) => (
                    <li key={number} className={`page-item ${currentPage === number && "active"}`}>
                      <button onClick={() => setCurrentPage(number)} className="page-link">
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
                {currentItems.length > 0 && (
                  <div>
                    <label className="d-inline-block me-2" htmlFor="pageSize">Page Size:</label>
                    <select id="pageSize" onChange={handlePageSizeChange} value={itemsPerPage}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                )}
                </div> */}
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
export default DispenseComponent;
