import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router';
import moment from 'moment';

const Analysis = () => {
	const { id } = useParams();
	const [collectionListing, setCollectionListing] = useState([]);
	const [BoxValue, setBoxValue] = useState('')
	const [userId, setUserId] = useState("");
	const [collectionPaientListing, setCollectionPaitedntListing] = useState([]);
	const [CollectionLensListing, setCollectionLensListing] = useState([])
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
	const [showblockLensModal, setShowBlockLensModal] = useState(false)
	const [showBlockedLensModel, setShowBlockedLensModel] = useState(false)
	const [activeLensId, SetActiveLensId] = useState("");
	const [activePatientId, setActivePatientId] = useState("")
	const [activePatientName, setActivePatientName] = useState("")
	const [filterPatientName, setFilterPatientName] = useState("")
	const [patientData, setPatientData] = useState([])

	useEffect(() => {
		if (id) {
			setCurrentPatientId(id);
		}
		getAlgoData();
		const userId = JSON.parse(localStorage.getItem('userId'))
		setUserId(userId)
	}, [])

	// const setdataForPatient = async (value) => {
	// 	const response = await fetch(`http://localhost:8080/api/v1/filterpatientById?id=${value}`, {
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

	useEffect(() => {
		if (userId) {
			getdata();
			getpatientData();
			getLensdata();

		}
	}, [userId]);



	const getAlgoData = async () => {
		const response = await fetch(`http://localhost:8080/api/v1/algoData`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}

		});
		const data = await response.json();
		// console.log('data',data);
		if (data && data.algoData && data.algoData.length > 0) {
			SetWC(data.algoData[0].WC);
			SetWS(data.algoData[0].WS);
			SetWA(data.algoData[0].WA);
			SetWB(data.algoData[0].WB);
			SetWMR(data.algoData[0].WMR);
			SetWML(data.algoData[0].WML);
		}
	}

	const handleBoxValue = (e) => {
		const selectedBoxName = e.target.value;
		setBoxValue(selectedBoxName)
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
			case value > -0.50 && value <= 0:
				return 25;
				break;
			case value > -1.00 && value <= -0.50:
				return 20;
				break;
			case value > -2.00 && value <= -1:
				return 10;
				break;
			case value > -3.00 && value <= -2:
				return 5;
				break;
			case value > -5.00 && value <= -3:
				return 4;
				break;
			default:
				return 0;
		}
	}

	const handleFilter = () => {
		if (!CollectionLensListing && CollectionLensListing.length === 0) return;
		if (!selectedPatientId) return;
		if (!validateForm()) {
			SetLenseListing([])
			//const selectedBox = collectionListing.find((x) => x.Box_Name === BoxValue);
			let selectedBoxLens = CollectionLensListing;
			// const selectedBoxLens = CollectionLensListing.filter((x) => x.Box_Name == BoxValue)
			// if (selectedBoxLens) {
			// 	SetLenseListing(selectedBoxLens);
			// } else {
			// 	SetLenseListing([]);
			// }

			let getPatientData = collectionPaientListing.find((x) => x.id === selectedPatientId);

			if (!getPatientData) return;
			// patient inputs as per documents 
			let patientRCYL = getPatientData.RCylinder;
			let patientLCYL = getPatientData.LCylinder;
			let patientRSPH = getPatientData.RSphere;
			let patientLSPH = getPatientData.LSphere;
			let patientRAXIS = getPatientData.RAxis;
			let patientLAXIS = getPatientData.LAxis;
			let patientRBIF = getPatientData.LBIF;
			let patientLBIF = getPatientData.RBIF;
			console.log("getPatientData", getPatientData);

			console.log("selectedBoxLens", selectedBoxLens);

			if (selectedBoxLens && selectedBoxLens.length > 0) {
				selectedBoxLens.map((x, i) => {
					// Search Algorithm Calculated Values 

					let LCE = x.LCylinder;
					let RCE = x.RCylinder;
					let LSE = x.LSphere;
					let RSE = x.RSphere;
					let LAE = x.LAxis;
					let RAE = x.RAxis;
					let LBE = x.LLBIF;
					let RBE = x.LRBIF;

					let LCD = Math.abs(patientLCYL - LCE);
					let LCDR = Math.abs(LCD / patientLCYL);
					let RCD = Math.abs(patientRCYL - RCE);
					let RCDR = Math.abs(RCD / patientRCYL);


					let LSD = Math.abs(patientLSPH - LSE);
					let LSDR = Math.abs(LSD / patientLSPH);
					let RSD = Math.abs(patientRSPH - RSE);
					let RSDR = Math.abs(RSD / patientRSPH);

					let LAD = Math.abs(patientLAXIS - LAE);
					let RAD = Math.abs(patientRAXIS - RAE);

					let LAMD = getAMDValue(patientLCYL);
					let RAMD = getAMDValue(patientRCYL);
					let LADR = LAD / LAMD;
					let RADR = RAD / RAMD;

					let LBD = Math.abs(patientLBIF - LBE);
					let LBDR = Math.abs(LBD / patientLBIF);
					let RBD = Math.abs(patientRBIF - RBE);
					let RBDR = Math.abs(RBD / patientRBIF);

					let MR = 100 - (WC * RCDR) - (WS * RSDR) - (WA * RADR) - (WB * RBDR);
					let ML = 100 - (WC * LCDR) - (WS * LSDR) - (WA * LADR) - (WB * LBDR);

					let M = (WMR * MR) + (WML * ML);

					let MRS = 100 - (WC * RCDR) - (WS * RSDR) - (WA * RADR);
					let MLS = 100 - (WC * LCDR) - (WS * LSDR) - (WA * LADR)

					// let MS = (WMR * MRS ) + ( WML * MLS )

					let RSEQ = patientRSPH + 0.5 * RCE
					let LSEQ = patientLSPH + 0.5 * LCE

					selectedBoxLens[i].PatientName = getPatientData.firstName + " " + getPatientData.lastName
					selectedBoxLens[i].lensId = x.lensId
					selectedBoxLens[i].LCD = LCD;
					selectedBoxLens[i].LCDR = LCDR;
					selectedBoxLens[i].RCD = RCD;
					selectedBoxLens[i].RCDR = RCDR;
					selectedBoxLens[i].LSD = LSD;
					selectedBoxLens[i].LSDR = LSDR;
					selectedBoxLens[i].RSD = RSD;
					selectedBoxLens[i].RSDR = RSDR;
					selectedBoxLens[i].LAD = LAD;
					selectedBoxLens[i].RAD = RAD;
					selectedBoxLens[i].LAMD = LAMD;
					selectedBoxLens[i].RAMD = RAMD;

					selectedBoxLens[i].LADR = LADR;
					selectedBoxLens[i].RADR = RADR;
					selectedBoxLens[i].LBD = LBD;
					selectedBoxLens[i].LBDR = LBDR;
					selectedBoxLens[i].RBD = RBD;
					selectedBoxLens[i].RBDR = RBDR;
					selectedBoxLens[i].MR = MR;
					selectedBoxLens[i].ML = ML;
					selectedBoxLens[i].M = M;
					selectedBoxLens[i].MRS = MRS;
					selectedBoxLens[i].MLS = MLS;
					selectedBoxLens[i].RSEQ = RSEQ;
					selectedBoxLens[i].LSEQ = LSEQ;

				})
				console.log("SetLenseListing(selectedBoxLens);", selectedBoxLens)
				// Assuming selectedBoxLens is an array of objects with 'booked' and 'blocked' properties
				let filteredLens = selectedBoxLens.filter(lens => !lens.Is_Blocked && !lens.Is_Booked);
				// filteredLens.push(collectionPaientListing);
				
			//filteredLens.push(collectionObject);
			let newArray = [collectionPaientListing[0],...filteredLens]
			console.log(newArray);
				// Now you can use the filteredLens array as needed
				SetLenseListing(newArray);

				// SetLenseListing(selectedBoxLens);
			}

		}


	}

	const getLensdata = async (matched) => {
		const queryParams = new URLSearchParams().toString();
		const getResponse = await fetch(`http://localhost:8080/api/v1/lens?${queryParams}&match=${matched}&userId=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}

		});
		if (getResponse.ok) {
			const data = await getResponse.json();
			console.log('111111111',data.Lenses_Data);
			setCollectionLensListing(data.Lenses_Data);
		} else {
			console.log('Get Failed');
		}

	}
	const getpatientData = async () => {
		const getResponse = await fetch(`http://localhost:8080/api/v1/patient?userId=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}

		});
		if (getResponse.ok) {
			const data = await getResponse.json();

			if(id){
				SetSelectedPatientId(data.Patient_Data.find(x => x.PatientId === id).id);
			}
			setCollectionPaitedntListing(data.Patient_Data);
		} else {
			console.log('Get Failed');
		}
	}
	const getdata = async () => {
		const getResponse = await fetch(`http://localhost:8080/api/v1/box?userId=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}

		});
		if (getResponse.ok) {
			const data = await getResponse.json();
			setCollectionListing(data.Boxes_Data);
		} else {
			console.log('Get Failed');
		}

	}


	const validateForm = () => {
		let isError = false;
		let error = {};
		// if (!BoxValue) {
		// 	error.BoxValue = "Required !";
		// 	isError = true;
		// }
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
		setCurrentPatientId(e.target.value)
	    //SetSelectedPatientId(e.target.value)
		const response = await fetch(`http://localhost:8080/api/v1/filterpatientById?id=${e.target.value}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				'Authorization': JSON.parse(localStorage.getItem('token'))
			}

		});
		if (response.ok) {
			const data = await response.json();
			setFilteredLens(data.Patient_Data);
		} else {
			console.log('Get Failed');
		}

	}

	const handleFiltedId = (selectedPatientRow) => {

		setCurrentPatientId(filteredLens.find(x => x.id == selectedPatientRow.id).PatientId)
		SetSelectedPatientId(selectedPatientRow.id)
		setFilteredLens([])
	}

	const dispenseLens = async (e, id) => {
		e.preventDefault();
		const info = {
			//patient_id: activePatientId,
			Lens_id: id,
			dispense: true,
			Patient_id: selectedPatientId,
		}
		await updateLens(info)
	}

	const returnLense = async (e, id) => {
		e.preventDefault();
		const info = {
			//patient_id: activePatientId,
			Lens_id: id,
			returned: true,
			Patient_id: selectedPatientId,
		}
		await updateLens(info)
	}

	const openBlockedModal = (lensId, booked) => {
		if (!booked) {
			setShowBlockedLensModel(true)
			SetActiveLensId(lensId)
		}
	}

	const closeBlockLensModel = () => {
		setShowBlockLensModal(false)
		setPatientData([]);
		setActivePatientName('')
		setShowBlockedLensModel(false);
	}

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
	// 		const getResponse = await fetch(`http://localhost:8080/api/v1/patientByName?name=${e.target.value}&userId=${userId}`, {
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
	// 		const response = await fetch(`http://localhost:8080/api/v1/patientById?id=${patientId}`, {
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
				lens_id: activeLensId
			}
			const response = await fetch(`http://localhost:8080/api/v1/block`, {
				method: 'PUT',
				body: JSON.stringify(info),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': JSON.parse(localStorage.getItem('token'))
				},
			});
			if (response.ok) {
				console.log('Lens Blocked Successfully');
				await getLensdata();
			} else {
				console.log('Lens not Blocked');
			}
			setShowBlockLensModal(false);
			setActivePatientId("")
			SetActiveLensId("")
			setActivePatientName('')
		}
	}

	const bookLens = async (e) => {
		e.preventDefault();
		const info = {
			//patient_id: activePatientId,
			Lens_id: activeLensId,
			Is_Booked: true
		}
		await updateLens(info)
		setShowBlockedLensModel(false);
		SetActiveLensId("")
	}

	const releaseLense = async (e) => {
		e.preventDefault();
		const info = {
			//patient_id: activePatientId,
			Lens_id: activeLensId,
			Is_Blocked: false,
			Patient_id: "",
		}
		await updateLens(info)
		setShowBlockedLensModel(false);
		SetActiveLensId("")
	}


	const updateLens = async (info) => {
		const response = await fetch(`http://localhost:8080/api/v1/lens`, {
			method: 'PUT',
			body: JSON.stringify(info),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': JSON.parse(localStorage.getItem('token'))
			},
		});
		if (response.ok) {
			console.log('Lens Blocked Successfully');
			await getLensdata();
			console.log('2222222222222222222222222');
		} else {
			console.log('Lens not Blocked');
		}
	}

	useEffect(() => {
		handleFilter()
	}, [CollectionLensListing])

	console.log('CollectionLensListing', CollectionLensListing);
	return (
		<>
			<div className="col p-5" style={{ marginRight: 34 }}>
				<div className='user_style'>
					<div className="user_name">
						<h2>Filter</h2>
						<hr className="mt-4" />
					</div>
					<div className="row search_input">
						{/* <div className="col">
							<div className="form-floating mb-3">
								<select
									className="form-select"
									id="floatingInput"
									name="Box_Name"
									onChange={handleBoxValue}
								>
									<option disabled selected value="">Box Name</option>
									{collectionListing.map((x) => (
										<option key={x.Box_Name} value={x.Box_Name}>
											{x.Box_Name}
										</option>
									))}
								</select>
								<label htmlFor="floatingInput">Box Name</label>
								<span className="text-danger">{validation.BoxValue}</span>
							</div>
						</div> */}
						<div className="col-lg-4 col-md-6 col-sm-12 col-12">
							<div className="form-floating mb-3">
								{/* <select
									className="form-select"
									id="selectBoxDate"
									name="Box_date"
									onChange={handlePatientName}
								><option disabled selected value="">Patient Name</option>
									{collectionPaientListing.map((x) => (
										<option key={x.id} value={x.id}>
											{x.firstName + " " + x.lastName}
										</option>
									))}

								</select> */}

								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="Patient Id"
									name='patientId'
									value={currentPatientId}
									onChange={(e) => { handleInputChange(e) }}
								/>
								<label htmlFor="selectBoxDate">Patient Id</label>
								<span className="text-danger">{validation.selectedPatientId}</span>
								{
									filteredLens && filteredLens.map(x => {
										return (
											<>
												<div className='filter_sugestions'>
													<span className='d-block' onClick={() => handleFiltedId(x)}>{x.PatientId}</span>
												</div>
											</>
										);
									})
								}
							</div>
						</div>
						<div className='col-lg-2 col-md-4 col-sm-12 col-12 mt-lg-0 mt-md-0 mt-4'>
							<button className="btn btn-primary w-100" onClick={handleFilter}><span>Filter</span></button>
						</div>
					</div>

					{/* <div className="row search_input">
						<div className="col">
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="WC"
									name='WC'
									value={WC}
									onChange={(e) => { SetWC(e.target.value) }}
								/>
								<label htmlFor="floatingInput">WC</label>
								<span className="text-danger">{validation.WC}</span>
							</div>
						</div>
						<div className="col">
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="WS"
									name='WS'
									value={WS}
									onChange={(e) => { SetWS(e.target.value) }}
								/>
								<label htmlFor="floatingInput">WS</label>
								<span className="text-danger">{validation.WS}</span>
							</div>
						</div>
						<div className="col">
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="WA"
									name='WA'
									value={WA}
									onChange={(e) => { SetWA(e.target.value) }}
								/>
								<label htmlFor="floatingInput">WA</label>
								<span className="text-danger">{validation.WA}</span>
							</div>
						</div>


					</div>

					<div className="row search_input">
						<div className="col">
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="WB"
									name='WB'
									value={WB}
									onChange={(e) => { SetWB(e.target.value) }}
								/>
								<label htmlFor="floatingInput">WB</label>
								<span className="text-danger">{validation.WB}</span>
							</div>
						</div>
						<div className="col">
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="WMR"
									name='WMR'
									value={WMR}
									onChange={(e) => { SetWMR(e.target.value) }}
								/>
								<label htmlFor="floatingInput">WMR</label>
								<span className="text-danger">{validation.WMR}</span>
							</div>
						</div>
						<div className="col">
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="floatingInput"
									placeholder="WML"
									name='WML'
									value={WML}
									onChange={(e) => { SetWML(e.target.value) }}
								/>
								<label htmlFor="floatingInput">WML</label>
								<span className="text-danger">{validation.WML}</span>
							</div>
						</div>


					</div> */}

					<div className="row search_input">
						<div className="col-lg-2">
							<div className="form-floating mb-3">

							</div>
						</div>
					</div>

					<div className="row mt-4">
						<div className="col-12">
							<div className="table_card analysis_table rounded">
								<table className="table">
									<thead className="rounded">
										<tr>
											<th colSpan={3} className='text-center'>EyeWare</th>
											<th colSpan={4} className='text-center'>Right Lens</th>
											<th colSpan={4} className='text-center'>Left Lens</th>
											<th colSpan={3} className='text-center'></th>
											{/* <th className='py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left'>Action</th> */}
										</tr>
										<tr>
											{/* <th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Patient Name
											</th> */}
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												 Id
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												%S
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												%Bi
											</th>

											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Sphere
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Cylinder
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
											 Axis
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Add
											</th>

											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Sphere
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Cylinder
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Axis
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Add
											</th>

											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Status
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Date
											</th>
											<th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												Time
											</th>

											{/* <th
												className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
												
											</th> */}

										</tr>
									</thead>
									<tbody>
										{lenseListing && lenseListing.length > 0 && lenseListing.map((x, id) => {
											return (
												//  
												<tr key={x.id} className= 'data'>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.PatientId}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>S</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>Bi</td>

													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.RSphere}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.RCylinder}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.RAxis}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.RAdd}</td>

													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.LSphere}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.LCylinder}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.LAxis}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.LAdd}</td>


													{/* <td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{x.Lens_Status}</td> */}
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>
                    {id === 0 ? (
                       'patient'
                    ) : (
					//	dispensed, Missing, Trashed
						<select  >
                            <option value="selected">Selected</option>
							<option value="available">Available</option>
							<option value="dispensed">Dispensed</option>
							<option value="missing">Missing</option>
							<option value="trashed">Trashed</option>
                        </select>
                    )}
                </td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{moment(x.createdAt).format('YYYY-MM-DD')}</td>
													<td className={id === 0 ? 'data_highlighted py-3 px-3 ' : 'data py-3 px-3 '}>{ moment(x.createdAt).format('hh:mm:ss')}</td>


													{/* <td className="todo-actions py-3 px-3" style={{ display: "inline-flex" }}>
														<div className='d-flex align-items-center gap-3'>
															{
																x.Is_Blocked
																	?
																	(<button className={x.Is_Booked ? "btn btn-primary bg-secondary" : "btn btn-primary bg-warning"} onClick={() => { openBlockedModal(x.id, x.Is_Booked) }}>
																		{!x.Is_Booked ? <strong>Blocked</strong> : <strong>Booked</strong>}
																	</button>)
																	:
																	(<button className="btn btn-primary bg-success" onClick={(e) => submitBlockLensModal(e, x.id)}>
																		<strong>Block Lens</strong>
																	</button>)
															}
															<button className={!x.dispense ? "btn btn-primary bg-success ml-2" : "btn btn-primary bg-secondary ml-2"} onClick={(e) => dispenseLens(e, x.id)}>
																<strong>Dispense </strong>
															</button>
															<button className={!x.returned ? "btn btn-primary bg-success ml-2" : "btn btn-primary bg-secondary ml-2"} onClick={(e) => returnLense(e, x.id)}>
																<strong>Return </strong>
															</button>
														</div>
													</td> */}
												</tr >

											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <Modal show={showblockLensModal} onHide={closeBlockLensModel}>
				<Modal.Header closeButton className=' bg-light'>
					<Modal.Title>Block Lens</Modal.Title>
				</Modal.Header>
				<Modal.Body className='p-0'>
					<div className='row bg-light text-center text-dark m-0'>
						<form>
							<div className='row search_input'>
								<div className='col-12 p-0'>
									<div className='p-3'>
										<div className="form-floating mb-0">
											<input className="form-control" name='patient_id' autoComplete="off" onChange=
												{changeBlockLensHandle} value={activePatientName} />
											<div className='suggestion_input'>
												{
													patientData.map((patient) => (
														<button type='button' key={patient.id} onClick={() => { selectPatient(patient.id, `${patient.firstName} ${patient.lastName}`, '') }}><span>{`${patient.firstName} ${patient.lastName}`}</span></button>

													))
												}
											</div>
											<label htmlFor="floatingInput">Patient Name</label>
										</div>
									</div>
								</div>
							</div>
							<Modal.Footer>
								<Button className='btn btn-primary bg-danger' variant="secondary" onClick={closeBlockLensModel}>Cancel</Button>
								<Button className='btn btn-primary bg-success' variant="primary" onClick={submitBlockLensModal}>Submit</Button>
							</Modal.Footer>
						</form>
					</div>
				</Modal.Body>
			</Modal> */}

			<Modal show={showBlockedLensModel} onHide={closeBlockLensModel}>
				<Modal.Header closeButton className=' bg-light'>
					<Modal.Title>Blocked lens</Modal.Title>
				</Modal.Header>
				<Modal.Body className='p-0'>
					<Modal.Footer>
						<Button className='btn btn-primary bg-danger' variant="secondary" onClick={releaseLense}>Release</Button>
						<Button className='btn btn-primary bg-success' variant="primary" onClick={bookLens}>Book</Button>
					</Modal.Footer>

				</Modal.Body>
			</Modal>

		</>
	)
}

export default Analysis