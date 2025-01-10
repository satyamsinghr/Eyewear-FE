import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import moment from "moment";
import { API_URL } from "./helper/common";
import { handleSignOut } from './utils/service';
const Analysis = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const patientInputRef = useRef();
  const [collectionListing, setCollectionListing] = useState([]);
  const [BoxValue, setBoxValue] = useState("");
  const [userId, setUserId] = useState("");
  const [collectionPaientListing, setCollectionPaientListing] = useState([]);
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
  const [role, setRole] = useState("");
  const [collId, setCollId] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [collName, setCollName] = useState('');
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
    const lensCollectionId = localStorage.getItem("selectedLensCollectionId");
    setSelectedCollectionId(lensCollectionId);
    getCollectionData(lensCollectionId);
    setRole(role);
    setCollId(collId)
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
  useEffect(() => {
    // Focus the input element when the component mounts
    patientInputRef.current && patientInputRef.current.focus();
  }, [lenseListing]);
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
      const collName = collectionData.filter((x) => x.id == lensCollectionId);
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
    patientId = currentPatientId
  ) => {
    if (!patientId) return;
    let analysedData = [];
    let patient = collectionPaientListing.find(
      (x) => x.PatientId === patientId
    );
    var lensData = [];
    if (lensData1 && lensData1.length > 0 && patient) {
      if (role == 1) {
        lensData = lensData1.filter((x) => x.CollectionId == patient.CollectionId);
      } else if (collId.includes(patient.CollectionId)) {
        lensData = lensData1.filter((x) => x.CollectionId == patient.CollectionId);
      } else {
        return false
      }
    }


    if (patient && lensData && lensData.length > 0 && eyewearConfig) {
      const parseToFloat = (value) => {
        const floatValue = parseFloat(value);
        return isNaN(floatValue) ? 0 : floatValue; // Return 0 instead of original value if NaN
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
      const LSphPat = parseToFloat(patient.LSphere);
      const RCylPat = parseToFloat(patient.RCylinder);
      const LCylPat = parseToFloat(patient.LCylinder);
      const RAxisPat = parseToFloat(patient.RAxis);
      const LAxisPat = parseToFloat(patient.LAxis);
      const RAddPat = parseToFloat(patient.RAdd);
      const LAddPat = parseToFloat(patient.LAdd);
      for (let lens of lensData) {

        //if (lens.lensId == 'AA4611') {

        // Yellow part
        let RSphEqPat = RSphPat + RCylPat / 2;
        let LSphEqPat = LSphPat + LCylPat / 2;

        //green part
        let {
          RSphere: RSphE,
          LSphere: LSphE,
          RCylinder: RCylE,
          LCylinder: LCylE,
          RAxis: RAxisE,
          LAxis: LAxisE,
          RAdd: RAddE,
          LAdd: LAddE,
        } = lens;

        RSphE = (RSphE !== null && RSphE !== undefined && !isNaN(parseToFloat(RSphE))) ? parseToFloat(RSphE) : 0;
        LSphE = (LSphE !== null && LSphE !== undefined && !isNaN(parseToFloat(LSphE))) ? parseToFloat(LSphE) : 0;
        RCylE = (RCylE !== null && RCylE !== undefined && !isNaN(parseToFloat(RCylE))) ? parseToFloat(RCylE) : 0;
        LCylE = (LCylE !== null && LCylE !== undefined && !isNaN(parseToFloat(LCylE))) ? parseToFloat(LCylE) : 0;
        RAxisE = (RAxisE !== null && RAxisE !== undefined && !isNaN(parseToFloat(RAxisE))) ? parseToFloat(RAxisE) : 0;
        LAxisE = (LAxisE !== null && LAxisE !== undefined && !isNaN(parseToFloat(LAxisE))) ? parseToFloat(LAxisE) : 0;
        RAddE = (RAddE !== null && RAddE !== undefined && !isNaN(parseToFloat(RAddE))) ? parseToFloat(RAddE) : 0;
        LAddE = (LAddE !== null && LAddE !== undefined && !isNaN(parseToFloat(LAddE))) ? parseToFloat(LAddE) : 0;


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
          (RAxisMaxDif - RAxisMinDif) !== 0
            ? ((RAxisDif - RAxisMinDif) / (RAxisMaxDif - RAxisMinDif)) * RAxisDif
            : 0;

        let LAxisRatio =
          (LAxisMaxDif - LAxisMinDif) !== 0
            ? ((LAxisDif - LAxisMinDif) / (LAxisMaxDif - LAxisMinDif)) * LAxisDif
            : 0;


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
        let RAddDif = !isNaN(Math.abs(RAddE - RAddPat)) ? Math.abs(RAddE - RAddPat) : 0;
        let LAddDif = !isNaN(Math.abs(LAddE - LAddPat)) ? Math.abs(LAddE - LAddPat) : 0;

        let RAddDifR = !isNaN(Math.abs((RAddDif - RAddPat) / RAddPat)) ? Math.abs((RAddDif - RAddPat) / RAddPat) : 0;
        let LAddDifR = !isNaN(Math.abs((LAddDif - LAddPat) / LAddPat)) ? Math.abs((LAddDif - LAddPat) / LAddPat) : 0;

        let RAddFactor = RAddDif * RAddMult;
        let LAddFactor = LAddDif * LAddMult;

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

        // let RMatchPercentageEqS =
        //   100 - RSphEqFactor - RCylEqFactor - RAxisEqFactor;
        // let LMatchPercentageEqS =
        //   100 - LSphEqFactor - LCylEqFactor - LAxisEqFactor;
        let RMatchPercentageEqS = 100 - RSphEqFactor;
        let LMatchPercentageEqS = 100 - LSphEqFactor;
        let MatchPercentageEqS =
          ((RMatchPercentageEqS + LMatchPercentageEqS) / 2).toFixed(2);;

        const lensData = {
          ...lens,
          MatchPercentageS: !isNaN(MatchPercentageS) ? parseFloat(MatchPercentageS) : 0, // Convert back to numeric value
          MatchPercentageB: !isNaN(MatchPercentageB) ? parseFloat(MatchPercentageB) : 0, // Convert back to numeric value
          MatchPercentageEqS: !isNaN(MatchPercentageEqS) ? parseFloat(MatchPercentageEqS) : 0, // Convert back to numeric value
        };

        analysedData = [...analysedData, lensData];

        //}

      }
      const newLensList = analysedData.filter(
        (x) => !x.Patient_id || x.Patient_id == patientId
      );

      // newLensList.sort(
      //   (a, b) =>
      //     b.MatchPercentageB - a.MatchPercentageB &&
      //     b.MatchPercentageS - a.MatchPercentageS
      // );
      newLensList.sort((a, b) => {
        // if (b.MatchPercentageB !== a.MatchPercentageB) {
        //   return b.MatchPercentageB - a.MatchPercentageB;
        // }
        return b.MatchPercentageS - a.MatchPercentageS;
      });
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
      const newLensListData = [...newLensList]
      if (newArray[0].RSphere < 0 || newArray[0].LSphere < 0) {
        const mergedArray = [...newArray,];
        SetLenseListing(mergedArray);
      } else {

        const selectedLenseStatus = newLensListData.filter(
          (x) => (x.Lens_Status === "available" || (x.Lens_Status === "reading" && x.MatchPercentageS >= 90))
        );
        const readingLenses = selectedLenseStatus
          .filter((x) => x.Lens_Status === "reading" && x.MatchPercentageS >= 90)
          .sort((a, b) => b.MatchPercentageS - a.MatchPercentageS) // Sort in descending order
          .slice(0, 5);
        // const selectedAddData = selectedLenseStatus.filter(
        //   (x) =>
        //     ((x.LAdd != null && x.LAdd !== '0' && x.LAdd !="") || (x.RAdd != null && x.RAdd !== '0' && x.RAdd !=""))
        // );

        const availableLenses = selectedLenseStatus
          .filter((x) => x.Lens_Status === "available")
          .sort((a, b) => b.MatchPercentageS - a.MatchPercentageS)
        // const mergedArray = [...newArray, ...readingLenses, ...availableLenses].slice(0, 21);
        const mergedArray = [
          ...newArray,
          ...readingLenses,
          ...availableLenses
        ].slice(0, 21).map(item => ({
          ...item,
          Lens_Label: (item.RAdd === "0" || item.RAdd === null) && (item.LAdd === "0" || item.LAdd === null) 
            ? "Single Vision" 
            : "Bifocal"
        }));
        SetLenseListing(mergedArray);
      }
    }
  };

  const axisMax = (CylPat) => {
    if (CylPat >= -0.5 && CylPat <= 0.0) return 30;
    if (CylPat >= -1.0 && CylPat < -0.5) return 24;
    if (CylPat >= -2.0 && CylPat < -1.0) return 16;
    if (CylPat >= -3.0 && CylPat < -2.0) return 12;
    if (CylPat >= -5.0 && CylPat < -3.0) return 8;
    return 0;
  };

  const axisMin = (CylPat) => {
    if (CylPat >= -0.5 && CylPat <= 0.0) return 7;
    if (CylPat >= -1.0 && CylPat < -0.5) return 6;
    if (CylPat >= -2.0 && CylPat < -1.0) return 4;
    if (CylPat >= -3.0 && CylPat < -2.0) return 3;
    if (CylPat >= -5.0 && CylPat < -3.0) return 2;
    return 0;
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
        setPatientData(data.Patient_Data);
        if (id) {
          SetSelectedPatientId(
            data.Patient_Data.find((x) => x.PatientId === id).id
          );
          // setCollectionPaientListing(data.Patient_Data.filter((x) => x.PatientId === id));
        }
        setCollectionPaientListing(data.Patient_Data);
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
    } else {
      let selectedReader = {
        Lens_Status: selectedStatus === 'readingSelected' ? 'selected' : 'reading',
        lensId: selectedRow.lensId,
        Patient_id: currentPatientId,
        CollectionId: selectedRow.CollectionId
      }
      const response = await fetch(`${API_URL}/v1/selectedReader`, {
        method: "POST",
        body: JSON.stringify(selectedReader),
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });
      if (response.ok) {
        console.log(" selectedReader saves Successfully");
        handleLensAlgorithm();
      } else {
        console.log("selectedReader not Blocked");
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
              <div
                className="table_card search_table analysis_table rounded pt-0"
              >
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
                      <th colSpan={4} className="text-center"></th>
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
                        Lens_Label
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
                      lenseListing?.length > 0 ?
                      lenseListing?.map((x, index) => {
                        return (
                          <tr key={x.index} className="data">
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {
                                id ? (
                                  index === 0 ? x?.PatientId : x?.lensId

                                ) : (
                                  index === 0 ? (
                                    <input
                                      type="text"
                                      ref={patientInputRef}
                                      value={currentPatientId}
                                      onChange={(e) => handleInputChange(e)}
                                    />
                                  ) : (
                                    x?.lensId
                                  )
                                )
                              }
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {index === 0 ? "100" : x?.MatchPercentageS}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {index === 0 ? "100" : x?.MatchPercentageB}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {/* {index === 0
                                ? "100"
                                : x.MatchPercentageEqS.toFixed(6)} */}
                              {index === 0
                                ? "100"
                                : typeof x?.MatchPercentageEqS === "number"
                                  ? x?.MatchPercentageEqS.toFixed(2)
                                  : "N/A"}
                            </td>

                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.RSphere}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.RCylinder}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.RAxis}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.RAdd}
                            </td>

                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.LSphere}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.LCylinder}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.LAxis}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {x?.LAdd}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {index === 0 ? (
                                "patient"
                              ) : (
                                <select
                                  onChange={(e) => handleStatusChange(e, x)}
                                >
                                  <option value="">Select Status</option>
                                  {x?.Lens_Status === "available" && (
                                    <>
                                      <option
                                        value="available"
                                        selected={x?.Lens_Status === "available"}
                                      >
                                        Available
                                      </option>
                                      <option
                                        value="selected"
                                        selected={x?.Lens_Status === "selected"}
                                      >
                                        Selected
                                      </option>
                                      <option
                                        value="dispensed"
                                        selected={x?.Lens_Status === "dispensed"}
                                      >
                                        Dispensed
                                      </option>
                                      <option
                                        value="missing"
                                        selected={x?.Lens_Status === "missing"}
                                      >
                                        Missing
                                      </option>
                                      <option
                                        value="trashed"
                                        selected={x?.Lens_Status === "trashed"}
                                      >
                                        Trashed
                                      </option>
                                    </>
                                  )}
                                  {x.Lens_Status === "reading" && (
                                    <>
                                      <option
                                        value="readingAvailable"
                                        selected={x?.Lens_Status === "selected" || x?.Lens_Status === "reading"}
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
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2"
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2"
                              }
                            >
                              {x.Lens_Label}
                            </td>

                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {moment(x?.createdAt).format("YYYY-MM-DD")}
                            </td>
                            <td
                              className={
                                index === 0
                                  ? "data_highlighted py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                                  : "data py-xl-3 py-lg-2 py-2 px-xl-2 px-lg-2 px-2 "
                              }
                            >
                              {moment(x?.createdAt).format("hh:mm:ss")}
                            </td>
                          </tr>
                        );
                      }) :
                      <tr>
                        <td>
                          <input
                            type="text"
                            ref={patientInputRef}
                            value={currentPatientId}
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
                        <td>
                        </td>
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
                      <span  className="d-inline-block me-2" htmlFor="pageSize">Page Size:</span>
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

export default Analysis;
