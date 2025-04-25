// import React, { useState, useEffect,useMemo } from "react";
// import axios from "axios";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import imageCompression from "browser-image-compression";
// import {
//   Search,
//   Plus,
//   Edit2,
//   Eye,
//   RefreshCw,
//   Trash2,
//   X,
//   Filter,
//   FileSpreadsheet,
//   Download,
// } from "lucide-react";
// import jsPDF from "jspdf";

// const TraineeManagement = () => {
//   const ip = import.meta.env.VITE_IP;
//   const [trainees, setTrainees] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [sports, setSports] = useState([]);
//   const [institutes, setInstitutes] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [showTraineePopup, setShowTraineePopup] = useState(false);
//   const [showRenewalPopup, setShowRenewalPopup] = useState(false);
//   const [editingTrainee, setEditingTrainee] = useState(null);
//   const [error, setError] = useState("");
//   const [renewalFormData, setRenewalFormData] = useState({
//     trainee_id: "",
//     name: "",
//     roll_no: "",
//     plan_id: "",
//     amount: 0,
//     method: "",
//     institute_id: "",
//     sport_id: "",
//     batch_id: "",
//     start_date: moment().format("YYYY-MM-DD"),
//     expiry_date: "",
//   });
//   const [traineeFormData, setTraineeFormData] = useState({
//     name: "",
//     father: "",
//     dob: moment().format("YYYY-MM-DD"),
//     address: "",
//     phone: "",
//     plan_id: "",
//     sport_id: "",
//     institute_id: "",
//     batch_id: "",
//     active: true,
//     photo: null,
//     fatherSignature: null,
//     occupation: "",
//     current_class: "",
//     name_of_school: "",
//     traineeSignature: null,
//     dateAndPlace: "",
//     amount: 0,
//     method: "",
//     start_date: moment().format("YYYY-MM-DD"),
//     expiry_date: "",
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [membershipFilter, setMembershipFilter] = useState("all");
//   const [selectedTrainee, setSelectedTrainee] = useState(null);
//   const [selectedSport, setSelectedSport] = useState("all");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const axiosInstance = axios.create({
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("userid")}`,
//     },
//   });

//   const formatTime = (timeStr) => {
//     const [hour, minute] = timeStr.split(':');
//     const date = new Date();
//     date.setHours(parseInt(hour));
//     date.setMinutes(parseInt(minute));
//     return date.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const day = date.getDate();
//     const month = date.getMonth() + 1; // Months are 0-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };
  

//   useEffect(() => {
//     fetchTrainees();
//     fetchPlans();
//     fetchSports();
//     fetchInstitutes();
//     fetchBatches();
//   }, []);


//   const handleDownloadReceipt = async (data) => {
//     try {
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "pt",
//         format: "a4",
//       });
  
//       // Colors (matching backend exactly)
//       const colors = {
//         primary: "#007e13", // Deep Blue
//         secondary: "#dbfee5", // Light Blue
//         text: "#1F2937", // Dark Gray
//         muted: "#6B7280", // Medium Gray
//         success: "#059669", // Green
//         border: "#E5E7EB", // Light Gray
//       };
  
//       // Normalize data to match backend traineeData structure
//       const trainee = {
//         name: data.name || "N/A",
//         phone: data.phone || data.roll_no || "N/A", // Use roll_no for renewals
//         sport_id: data.sport_id || "",
//         batch_id: data.batch_id || "",
//         plan_id: data.plan_id || "",
//         amount: data.amount || 0,
//         method: data.method || "N/A",
//         from: data.start_date || data.from || "",
//         to: data.expiry_date || data.to || "",
//       };
  
//       // Header Section (white background)
//       doc.setFillColor("#FFFFFF");
//       doc.rect(0, 0, 595.28, 120, "F"); // A4 width = 595.28pt
  
//       // Logo (load from public/logo.jpg)
//       const logoUrl = "/logo.jpg";
//       try {
//         const logoImg = await new Promise((resolve, reject) => {
//           const img = new Image();
//           img.crossOrigin = "Anonymous";
//           img.src = logoUrl;
//           img.onload = () => resolve(img);
//           img.onerror = () => reject(new Error("Failed to load logo"));
//         });
//         doc.addImage(logoImg, "JPEG", 40, 20, 120, 0);
//       } catch (err) {
//         console.warn("Failed to load logo:", err);
//         doc.setFontSize(10);
//         doc.setTextColor(colors.muted);
//         doc.text("Logo not available", 40, 30);
//       }
  
//       // Institute Details
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(colors.text);
//       doc.text("KAVYA SPORTS ACADEMY", 40, 150);
//       doc.setFontSize(10);
//       doc.setTextColor(colors.muted);
//       doc.text("+91 94292 67077", 40, 165);
//       doc.text(
//         "FP-9, Opp. Diamond 27, Nr. Kadi Nagrik Bank, TP 69, New Chandkheda, Ahmedabad-382424",
//         40,
//         180,
//         { maxWidth: 200 }
//       );
  
//       // Receipt Title
//       doc.setFontSize(18);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(colors.primary);
//       doc.text("PAYMENT RECEIPT", 572, 40, { align: "right" });
  
//       // Divider
//       doc.setLineWidth(1);
//       doc.setDrawColor(colors.border);
//       doc.line(40, 220, 572, 220);
  
//       // Receipt Details
//       const receiptDate = new Date().toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(colors.muted);
//       doc.text(`Date: ${receiptDate}`, 40, 240);
  
//       // Student Details
//       doc.setFontSize(14);
//       doc.setTextColor(colors.primary);
//       doc.text("Student Details:", 40, 280);
//       doc.setFontSize(11);
//       doc.setTextColor(colors.text);
//       doc.text(`Name: ${trainee.name}`, 40, 305);
//       doc.text(`Mobile: ${trainee.phone}`, 40, 325);
  
//       // Payment Details Table
//       const tableTop = 350;

//       // Table Header
//       doc.setFillColor(colors.primary);
//       doc.rect(40, tableTop, 532, 30, "F");
//       doc.setFontSize(10);
//       doc.setTextColor(255, 255, 255);
//       doc.text("No.", 50, tableTop + 10);
//       doc.text("Sport Name", 80, tableTop + 10);
//       doc.text("Slot & Timing", 200, tableTop + 10);
//       doc.text("Selected Plan", 330, tableTop + 10);
//       doc.text("Amount", 492, tableTop + 10, { align: "right" });

//       // Table Row
//       const rowY = tableTop + 32; // Increased from 30 to 40 for more space
//       doc.setFillColor(colors.secondary);
//       doc.rect(40, rowY, 532, 30, "F");

//       // Sport Name
//       const sportName = getSportName(trainee.sport_id) || "N/A";
//       doc.setFontSize(10);
//       doc.setTextColor(colors.text);
//       doc.text("1", 50, rowY + 10);
//       doc.text(sportName, 80, rowY + 10, { maxWidth: 110 });

//       // Slot & Timing
//       const batch = batches.find((b) => b._id === trainee.batch_id);
//       const slotTiming = batch ? batch.name : "N/A";
//       const slotTimeDetails = batch ? `(${formatTime(batch.start_time)} - ${formatTime(batch.end_time)})` : "";
//       doc.setFontSize(10);
//       doc.text(slotTiming, 200, rowY + 10, { maxWidth: 120 });
//       doc.setFontSize(8);
//       doc.text(slotTimeDetails, 200, rowY + 22, { maxWidth: 120 });

//       // Selected Plan
//       const plan = plans.find((p) => p._id === trainee.plan_id);
//       const planTiming = plan ? plan.name : "N/A";
//       const planDateDetails =
//         trainee.from && trainee.to
//           ? `(${formatDate(trainee.from)} - ${formatDate(trainee.to)})`
//           : "";
//       doc.setFontSize(10);
//       doc.text(planTiming, 330, rowY + 10, { maxWidth: 150 });
//       doc.setFontSize(8);
//       doc.text(planDateDetails, 330, rowY + 22, { maxWidth: 150 });

//       // Amount
//       doc.setFontSize(10);
//       doc.text(
//         trainee.amount ? `Rs. ${trainee.amount}` : "N/A",
//         492,
//         rowY + 10,
//         { align: "right" }
//       );
        
//       // Total Amount
//       const totalY = rowY + 50;
//       doc.setFontSize(12);
//       doc.setTextColor(colors.primary);
//       doc.text("Total Amount:", 370, totalY);
//       doc.setFontSize(14);
//       doc.setTextColor(colors.text);
//       doc.text(
//         trainee.amount ? `Rs. ${trainee.amount}` : "N/A",
//         510,
//         totalY,
//         { align: "right" }
//       );
  
//       // Payment Method
//       const paymentY = totalY + 50;
//       doc.setLineWidth(0.5);
//       doc.setDrawColor(colors.border);
//       doc.line(40, paymentY, 572, paymentY);
//       doc.setFontSize(12);
//       doc.setTextColor(colors.primary);
//       doc.text("Payment Details:", 40, paymentY + 15);
//       doc.setFontSize(10);
//       doc.setTextColor(colors.text);
//       doc.text(`Method: ${trainee.method === "UPI" ? "ONLINE" : trainee.method || "N/A"}`, 40, paymentY + 35);
//       doc.text("Status: Paid", 40, paymentY + 55);
//       doc.setTextColor(colors.success);
  
//       // Footer
//       doc.setFontSize(8);
//       doc.setTextColor(colors.muted);
//       doc.text(
//         "This is a computer-generated receipt. No signature required.",
//         297.5,
//         750,
//         { align: "center" }
//       );
  
//       // Download the PDF
//       doc.save(`Receipt_${trainee.name}.pdf`);
//     } catch (error) {
//       console.error("Error generating receipt:", error);
//       setError("Failed to generate receipt. Please try again.");
//     }
//   };

//   // const fetchTrainees = async () => {
//   //   try {
//   //     const response = await axios.get(`${ip}/api/academy/trainees`);
//   //     setTrainees(response.data);
//   //     console.log(response)
//   //   } catch (error) {
//   //     console.error("Error fetching Students:", error);
//   //     setError(
//   //       error.response?.data?.message ||
//   //         "Failed to fetch Students. Please try again."
//   //     );
//   //   }
//   // };


//   const fetchTrainees = async () => {
//     try {
//       const response = await axios.get(`${ip}/api/academy/trainees`);
//       const normalizedTrainees = response.data.map((trainee) => ({
//         ...trainee,
//         start_date: trainee.from || trainee.start_date,
//         expiry_date: trainee.to || trainee.expiry_date,
//       }));
//       setTrainees(normalizedTrainees);
//     } catch (error) {
//       console.error("Error fetching Students:", error);
//       setError(
//         error.response?.data?.message ||
//           "Failed to fetch Students. Please try again."
//       );
//     }
//   };


//   const fetchPlans = async () => {
//     try {
//       const response = await axiosInstance.post(
//         `${ip}/api/academy/active-plans`
//       );
//       setPlans(response.data);
//     } catch (error) {
//       console.error("Error fetching plans:", error);
//       setError("Failed to fetch plans. Please try again.");
//     }
//   };

//   const fetchSports = async () => {
//     try {
//       const response = await axios.post(`${ip}/api/academy/all-sports`, {
//         userId: localStorage.getItem("userid"),
//       });
//       setSports(response.data);
//     } catch (error) {
//       console.error("Error fetching sports:", error);
//       setError("Failed to fetch sports. Please try again.");
//     }
//   };

//   const fetchInstitutes = async () => {
//     try {
//       const response = await axios.post(`${ip}/api/academy/all-institutes`, {
//         userId: localStorage.getItem("userid"),
//       });
//       setInstitutes(response.data);
//     } catch (error) {
//       console.error("Error fetching institutes:", error);
//       setError("Failed to fetch institutes. Please try again.");
//     }
//   };

//   const fetchBatches = async () => {
//     try {
//       const response = await axios.post(`${ip}/api/academy/all-batches`, {
//         userId: localStorage.getItem("userid"),
//       });
//       setBatches(response.data);
//     } catch (error) {
//       console.error("Error fetching batches:", error);
//       setError("Failed to fetch batches. Please try again.");
//     }
//   };

//   const getSportName = (sportId) => {
//     const sport = sports.find((s) => s._id === sportId);
//     return sport ? sport.name : sportId || "N/A";
//   };

//   const getInstituteName = (instituteId) => {
//     const institute = institutes.find((i) => i._id === instituteId);
//     return institute ? institute.name : instituteId || "N/A";
//   };

//   const getBatchName = (batchId) => {
//   const batch = batches.find((b) => b._id === batchId);
//   return batch
//     ? `${batch.name} (${formatTime(batch.start_time)} - ${formatTime(batch.end_time)})`
//     : batchId || "N/A";
// };

//   // Filter batches based on selected sport
//   const getFilteredBatches = (sportId) => {
//     if (!sportId) return [];
//     return batches.filter(
//       (batch) => batch.sport_id && batch.sport_id._id === sportId
//     );
//   };

//   const compressImage = async (file) => {
//     if (!file) return null;
//     const options = {
//       maxSizeMB: 0.05,
//       maxWidthOrHeight: 1024,
//       useWebWorker: true,
//     };
//     try {
//       const compressedFile = await imageCompression(file, options);
//       return new File([compressedFile], file.name, { type: file.type });
//     } catch (error) {
//       console.error("Error compressing image:", error);
//       setError("Failed to compress image. Please try again.");
//       return null;
//     }
//   };

//   const handleFileChange = async (e, field) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     try {
//       const compressedFile = await compressImage(file);
//       if (compressedFile) {
//         setTraineeFormData({ ...traineeFormData, [field]: compressedFile });
//         setError("");
//       }
//     } catch (error) {
//       console.error("Error handling file:", error);
//       setError("Failed to process image. Please try again.");
//     }
//   };

//   const calculateTraineeExpiryDate = (planId, startDate) => {
//     if (!planId || !startDate) return "";
//     const selectedPlan = plans.find((plan) => plan._id === planId);
//     if (!selectedPlan || !selectedPlan.plan_limit) return "";
//     const expiryDate = moment(startDate)
//       .add(selectedPlan.plan_limit, "days")
//       .format("YYYY-MM-DD");
//     return expiryDate;
//   };

//   const handleTraineeInputChange = (e) => {
//     const { name, value } = e.target;
//     let updatedFormData = { ...traineeFormData, [name]: value };

//     if (name === "sport_id") {
//       // Reset batch_id when sport changes
//       updatedFormData.batch_id = "";
//     } else if (name === "plan_id") {
//       const selectedPlan = plans.find((plan) => plan._id === value);
//       const expiryDate = calculateTraineeExpiryDate(
//         value,
//         traineeFormData.start_date
//       );
//       updatedFormData.amount = selectedPlan ? selectedPlan.amount : 0;
//       updatedFormData.expiry_date = expiryDate;
//     } else if (name === "start_date") {
//       const expiryDate = calculateTraineeExpiryDate(
//         traineeFormData.plan_id,
//         value
//       );
//       updatedFormData.expiry_date = expiryDate;
//     }

//     setTraineeFormData(updatedFormData);
//   };

//   const handleRenewalInputChange = (e) => {
//     const { name, value } = e.target;
//     let updatedFormData = { ...renewalFormData, [name]: value };

//     if (name === "sport_id") {
//       // Reset batch_id when sport changes
//       updatedFormData.batch_id = "";
//     } else if (name === "plan_id") {
//       const selectedPlan = plans.find((plan) => plan._id === value);
//       const expiryDate = calculateTraineeExpiryDate(
//         value,
//         renewalFormData.start_date
//       );
//       updatedFormData.amount = selectedPlan ? selectedPlan.amount : 0;
//       updatedFormData.expiry_date = expiryDate;
//     } else if (name === "start_date") {
//       const expiryDate = calculateTraineeExpiryDate(
//         renewalFormData.plan_id,
//         value
//       );
//       updatedFormData.expiry_date = expiryDate;
//     }

//     setRenewalFormData(updatedFormData);
//   };

//   const handleTraineeSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     // console.log("handleTraineeSubmit started");
  
//     // Validation checks
//     if (!traineeFormData.sport_id) {
//       setError("Please select a sport.");
//       // console.log("Validation failed: sport_id missing");
//       return;
//     }
  
//     if (!traineeFormData.batch_id) {
//       setError("Please select a batch.");
//       // console.log("Validation failed: batch_id missing");
//       return;
//     }
  
//     if (!traineeFormData.institute_id) {
//       setError("Please select an institute.");
//       // console.log("Validation failed: institute_id missing");
//       return;
//     }
  
//     // Prepare form data
//     const formData = new FormData();
//     Object.keys(traineeFormData).forEach((key) => {
//       if (
//         key === "photo" ||
//         key === "traineeSignature" ||
//         key === "fatherSignature"
//       ) {
//         if (traineeFormData[key]) {
//           formData.append(key, traineeFormData[key]);
//         }
//       } else {
//         formData.append(key, traineeFormData[key]);
//       }
//     });
  
//     try {
//       console.log("Entering try block");
//       const userId = localStorage.getItem("userid");
//       if (!userId) {
//         setError("User not authenticated. Please login again.");
//         // console.log("Authentication failed: no userId");
//         return;
//       }
  
//       const config = {
//         headers: {
//           Authorization: `Bearer ${userId}`,
//           "Content-Type": "multipart/form-data",
//         },
//       };
//       let response;
//       if (editingTrainee) {
//         // console.log("Updating trainee:", editingTrainee._id);
//        response= await axios.put(
//           `${ip}/api/manager/update-trainee/${editingTrainee._id}`,
//           formData,
//           config
//         );
//         // console.log("Trainee update successful");
//       } else {
//         // console.log("Adding new trainee");
//         // Add timeout to prevent hanging
//         response = await Promise.race([
//           axios.post(`${ip}/api/manager/add-new-trainee`, formData, config),
//           new Promise((_, reject) =>
//             setTimeout(() => reject(new Error("API call timed out")), 10000)
//           ),
//         ]);
//         console.log("API response:", response ? response.data : "No response data");
//         console.log("Trainee addition successful");
//       }
  
//       if (response.status == 200){
//       // console.log("Resetting form and closing popup");
//       await fetchTrainees();
//       setShowTraineePopup(false);
//       setEditingTrainee(null);

//       setTraineeFormData({
//         name: "",
//         father: "",
//         dob: moment().format("YYYY-MM-DD"),
//         address: "",
//         phone: "",
//         plan_id: "",
//         sport_id: "",
//         institute_id: institutes.length > 0 ? institutes[0]._id : "",
//         batch_id: "",
//         active: true,
//         photo: null,
//         fatherSignature: null,
//         occupation: "",
//         current_class: "",
//         name_of_school: "",
//         traineeSignature: null,
//         dateAndPlace: "",
//         amount: 0,
//         method: "",
//         start_date: moment().format("YYYY-MM-DD"),
//         expiry_date: "",
//       });
//       // setEditingTrainee(null);
//       setError("");
//       // setShowTraineePopup(false); // Close popup
//       // await fetchTrainees();
//     }
//     } catch (error) {
//       console.error("Error in handleTraineeSubmit:", error.message);
//       console.log("Full error object:", error);
//       let errorMessage = "Failed to submit Student data. Please try again.";
//       if (error.response && error.response.data) {
//         if (error.response.data instanceof Blob) {
//           const errorText = await error.response.data.text();
//           console.log("Blob error text:", errorText);
//           try {
//             const errorJson = JSON.parse(errorText);
//             errorMessage = errorJson.message || errorMessage;
//           } catch {
//             errorMessage = errorText || errorMessage;
//           }
//         } else {
//           errorMessage = error.response.data.message || errorMessage;
//           console.log("Error response data:", error.response.data);
//         }
//       }
//       setError(errorMessage);
//       console.log("Error set:", errorMessage);
//       // Close popup to prevent hanging
//       setShowTraineePopup(false);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     if (institutes.length > 0 && !traineeFormData.institute_id) {
//       setTraineeFormData((prev) => ({
//         ...prev,
//         institute_id: institutes[0]._id,
//       }));
//     }
//   }, [institutes]);

//   const handleRenewalSubmit = async (e) => {
//     e.preventDefault();
//     if (!renewalFormData.sport_id) {
//       setError("Please select a sport.");
//       return;
//     }
//     if (!renewalFormData.batch_id) {
//       setError("Please select a batch.");
//       return;
//     }
//     try {
//       const userId = localStorage.getItem("userid");
//       if (!userId) {
//         setError("User not authenticated. Please login again.");
//         return;
//       }
  
//       const config = {
//         headers: {
//           Authorization: `Bearer ${userId}`,
//         },
//       };
  
//       await axios.post(
//         `${ip}/api/academy/renewal`,
//         renewalFormData,
//         config
//       );
  
//       // Prepare data for PDF
//       const pdfData = {
//         name: renewalFormData.name,
//         roll_no: renewalFormData.roll_no,
//         sport_id: renewalFormData.sport_id,
//         batch_id: renewalFormData.batch_id,
//         plan_id: renewalFormData.plan_id,
//         amount: renewalFormData.amount,
//         method: renewalFormData.method,
//         start_date: renewalFormData.start_date,
//         expiry_date: renewalFormData.expiry_date,
//       };
  
//       // Generate PDF
//       await handleDownloadReceipt(pdfData);
  
//       // Refresh trainees and reset form
//       await fetchTrainees();
//       setShowRenewalPopup(false);
//       setRenewalFormData({
//         trainee_id: "",
//         name: "",
//         roll_no: "",
//         plan_id: "",
//         amount: 0,
//         method: "",
//         institute_id: "",
//         sport_id: "",
//         batch_id: "",
//         start_date: moment().format("YYYY-MM-DD"),
//         expiry_date: "",
//       });
//       setError("");
//       alert("Membership renewed successfully!");
//     } catch (error) {
//       console.error("Error submitting renewal data:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to submit renewal data. Please check your inputs and try again.";
//       setError(errorMessage);
//     }
//   };


//   const openTraineePopup = (trainee = null) => {
//     setEditingTrainee(trainee);
//     setTraineeFormData(
//       trainee
//         ? {
//             ...trainee,
//             dob: trainee.dob
//               ? moment(trainee.dob).format("YYYY-MM-DD")
//               : moment().format("YYYY-MM-DD"),
//             start_date: trainee.from
//               ? moment(trainee.from).format("YYYY-MM-DD")
//               : moment().format("YYYY-MM-DD"),
//             expiry_date: trainee.to
//               ? moment(trainee.to).format("YYYY-MM-DD")
//               : "",
//             sport_id: trainee.sport_id || "",
//             institute_id: trainee.institute_id || "",
//             batch_id: trainee.batch_id || "",
//             plan_id: trainee.plan_id || "",
//             photo: null,
//             traineeSignature: null,
//             fatherSignature: null,
//           }
//         : {
//             name: "",
//             father: "",
//             dob: moment().format("YYYY-MM-DD"),
//             address: "",
//             phone: "",
//             plan_id: "",
//             sport_id: "",
//             institute_id: "",
//             batch_id: "",
//             active: true,
//             photo: null,
//             fatherSignature: null,
//             occupation: "",
//             current_class: "",
//             name_of_school: "",
//             traineeSignature: null,
//             dateAndPlace: "",
//             amount: 0,
//             method: "",
//             start_date: moment().format("YYYY-MM-DD"),
//             expiry_date: "",
//           }
//     );
//     setShowTraineePopup(true);
//   };

//   const openRenewalPopup = (trainee) => {
//     const startDate = moment().format("YYYY-MM-DD");
//     const expiryDate = calculateTraineeExpiryDate(trainee.plan_id, startDate);
//     setRenewalFormData({
//       trainee_id: trainee._id,
//       name: trainee.name,
//       roll_no: trainee.roll_no,
//       plan_id: trainee.plan_id || "",
//       amount: trainee.amount || 0,
//       method: "",
//       institute_id: trainee.institute_id || "",
//       sport_id: trainee.sport_id || "",
//       batch_id: trainee.batch_id || "",
//       start_date: startDate,
//       expiry_date: expiryDate,
//     });
//     setShowRenewalPopup(true);
//   };

//   const handleCancel = () => {
//     setShowTraineePopup(false);
//     setShowRenewalPopup(false);
//     setError("");
//   };

//   const formatDateTime1 = (dateTime) => moment(dateTime).format("DD-MM-YYYY");

//   const isRenewalAllowed = (expiryDate) => {
//     const today = moment();
//     const expiry = moment(expiryDate);
//     const daysUntilExpiry = expiry.diff(today, "days");
//     return daysUntilExpiry <= 3 && daysUntilExpiry >= -36500;
//   };

//   const handleDeleteTrainee = async (id) => {
//     try {
//       const userId = localStorage.getItem("userid");
//       if (!userId) {
//         setError("User not authenticated. Please login again.");
//         return;
//       }

//       await axiosInstance.post(`${ip}/api/manager/delete-trainee`, {
//         id,
//         userid: userId,
//       });
//       fetchTrainees();
//     } catch (error) {
//       console.error("Error deleting Student:", error);
//       setError(
//         error.response?.data?.message ||
//           "Failed to delete Student. Please try again."
//       );
//     }
//   };

//   const exportToExcel = () => {
//     if (trainees.length === 0) {
//       alert("No Student data available for export.");
//       return;
//     }
//     const excelData = trainees.map((trainee) => ({
//       Name: trainee.name,
//       "Father's Name": trainee.father,
//       Phone: trainee.phone,
//       DOB: moment(trainee.dob).format("DD-MM-YYYY"),
//       Address: trainee.address,
//       Plan: trainee.plan_id,
//       Sport: getSportName(trainee.sport_id),
//       Institute: getInstituteName(trainee.institute_id),
//       Batch: getBatchName(trainee.batch_id),
//       "Start Date": moment(trainee.start_date).format("DD-MM-YYYY"),
//       "Expiry Date": moment(trainee.expiry_date).format("DD-MM-YYYY"),
//       "Amount Paid": `₹${trainee.amount}`,
//       Active: trainee.active ? "Yes" : "No",
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
//     });
//     saveAs(blob, `Student_Data_${moment().format("YYYY-MM-DD")}.xlsx`);
//   };

//   const handleViewTrainee = (trainee) => {
//     setSelectedTrainee(trainee);
//   };

//   const handleClosePopup = () => {
//     setSelectedTrainee(null);
//   };

//   // const filteredTrainees = trainees.filter((trainee) => {
//   //   const searchLower = searchQuery.toLowerCase();
//   //   const matchesSearch =
//   //     trainee.name.toLowerCase().includes(searchLower) ||
//   //     trainee.roll_no.toLowerCase().includes(searchLower);
    
//   //   const today = moment();
//   //   const isExpired = moment(trainee.to).isBefore(today, "day");
//   //   const isActive = !isExpired;
    
//   //   const matchesMembershipFilter =
//   //     membershipFilter === "all" ||
//   //     (membershipFilter === "expired" && isExpired) ||
//   //     (membershipFilter === "active" && isActive);

//   //   const matchesSportFilter =
//   //     selectedSport === "all" || trainee.sport_id === selectedSport;

//   //   return matchesSearch && matchesMembershipFilter && matchesSportFilter;
//   // });


//   const filteredTrainees = useMemo(() => {
//     return trainees.filter((trainee) => {
//       const searchLower = searchQuery.toLowerCase();
//       const matchesSearch =
//         trainee.name.toLowerCase().includes(searchLower) ||
//         trainee.roll_no.toLowerCase().includes(searchLower);
  
//       const today = moment();
//       const isExpired = moment(trainee.to).isBefore(today, "day");
//       const isActive = !isExpired;
  
//       const matchesMembershipFilter =
//         membershipFilter === "all" ||
//         (membershipFilter === "expired" && isExpired) ||
//         (membershipFilter === "active" && isActive);
  
//       const matchesSportFilter =
//         selectedSport === "all" || trainee.sport_id === selectedSport;
  
//       return matchesSearch && matchesMembershipFilter && matchesSportFilter;
//     });
//   }, [trainees, searchQuery, membershipFilter, selectedSport]);

//   const calculateAge = (dob) => {
//     if (!dob) return "";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }
//     return age;
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-0 md:p-6">
//       <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">
//           Student Management ({filteredTrainees.length})
//         </h2>
//         <div className="flex flex-wrap gap-4 items-center">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search by name or roll no..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
//             />
//           </div>
//           <div className="relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <select
//               value={membershipFilter}
//               onChange={(e) => setMembershipFilter(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//             >
//               <option value="all">All Memberships</option>
//               <option value="expired">Expired Memberships</option>
//               <option value="active">Active Memberships</option>
//             </select>
//           </div>
//           <div className="relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <select
//               value={selectedSport}
//               onChange={(e) => setSelectedSport(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//             >
//               <option value="all">All Sports</option>
//               {sports.map((sport) => (
//                 <option key={sport._id} value={sport._id}>
//                   {sport.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             onClick={exportToExcel}
//             className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base"
//           >
//             <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
//             Export Excel
//           </button>
//           <button
//             onClick={() => openTraineePopup()}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus className="w-5 h-5" />
//             Add Student
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-700">{error}</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {filteredTrainees.map((trainee) => (
//           <div
//             key={trainee._id}
//             className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
//           >
//             <div className="flex items-start p-4 gap-4">
//               <div className="flex-shrink-0">
//                 <img
//                   src={`${ip}/Uploads/${trainee.photo}`}
//                   alt={trainee.name}
//                   className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
//                   onClick={() => handleViewTrainee(trainee)}
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-lg font-semibold text-gray-900 truncate">
//                   {trainee.name}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   Roll No:{" "}
//                   <span className="font-medium">{trainee.roll_no}</span>
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Sport:{" "}
//                   <span className="font-medium">
//                     {getSportName(trainee.sport_id)}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Institute:{" "}
//                   <span className="font-medium">
//                     {getInstituteName(trainee.institute_id)}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Batch:{" "}
//                   <span className="font-medium">
//                     {getBatchName(trainee.batch_id)}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Expires:{" "}
//                   <span className="font-medium">
//                     {formatDate(trainee.to)}
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end gap-2">
//               <button
//                 onClick={() => openTraineePopup(trainee)}
//                 className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
//                 title="Edit"
//               >
//                 <Edit2 className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => handleViewTrainee(trainee)}
//                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                 title="View Details"
//               >
//                 <Eye className="w-5 h-5" />
//               </button>
//               {isRenewalAllowed(trainee.to) && (
//                 <button
//                   onClick={() => openRenewalPopup(trainee)}
//                   className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
//                   title="Renew Membership"
//                 >
//                   <RefreshCw className="w-5 h-5" />
//                 </button>
//               )}
//               <button
//     onClick={() => handleDownloadReceipt(trainee)}
//     className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
//     title="Download Receipt"
//   >
//     <Download className="w-5 h-5" />
//   </button>
//               <button
//                 onClick={() => handleDeleteTrainee(trainee._id)}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                 title="Delete"
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedTrainee && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Student Details
//                 </h2>
//                 <button
//                   onClick={handleClosePopup}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <X className="w-6 h-6 text-gray-500" />
//                 </button>
//               </div>
//               <div className="grid grid-cols-3 gap-6 mb-6">
//                 <div className="flex flex-col items-center">
//                   <span className="text-sm text-gray-600 mb-2">
//                     Student Photo
//                   </span>
//                   <img
//                     src={`${ip}/Uploads/${selectedTrainee.photo}`}
//                     alt="Student"
//                     className="w-32 h-44 object-cover rounded-lg border border-gray-200"
//                   />
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <span className="text-sm text-gray-600 mb-2">
//                     Student's Signature
//                   </span>
//                   <img
//                     src={`${ip}/Uploads/${selectedTrainee.signature}`}
//                     alt="Student Signature"
//                     className="w-32 h-44 object-cover rounded-lg border border-gray-200"
//                   />
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <span className="text-sm text-gray-600 mb-2">
//                     Father's Signature
//                   </span>
//                   <img
//                     src={`${ip}/Uploads/${selectedTrainee.father_signature}`}
//                     alt="Father's Signature"
//                     className="w-32 h-44 object-cover rounded-lg border border-gray-200"
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DetailItem label="Name" value={selectedTrainee.name} />
//                 <DetailItem label="Roll No" value={selectedTrainee.roll_no} />
//                 <DetailItem
//                   label="Father's Name"
//                   value={selectedTrainee.father}
//                 />
//                 <DetailItem label="Phone" value={selectedTrainee.phone} />
//                 <DetailItem
//                   label="Start Date"
//                   value={formatDate(selectedTrainee.from)}
//                 />
//                 <DetailItem
//                   label="Expiry Date"
//                   value={formatDate(selectedTrainee.to)}
//                 />
//                 <DetailItem
//                   label="Amount"
//                   value={`₹${selectedTrainee.amount}`}
//                 />
//                 <DetailItem
//                   label="Father's Occupation"
//                   value={selectedTrainee.occupation}
//                 />
//                 <DetailItem
//                   label="Sport"
//                   value={getSportName(selectedTrainee.sport_id)}
//                 />
//                 <DetailItem
//                   label="Institute"
//                   value={getInstituteName(selectedTrainee.institute_id)}
//                 />
//                 <DetailItem
//                   label="Batch"
//                   value={getBatchName(selectedTrainee.batch_id)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showTraineePopup && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
//           <div className="min-h-screen px-4 py-8 flex items-center justify-center">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative">
//               <button
//                 onClick={handleCancel}
//                 className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//               <div className="p-6 sm:p-8">
//                 <h3 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
//                   {editingTrainee ? "Edit Student" : "Add New Student"}
//                 </h3>
//                 <form onSubmit={handleTraineeSubmit} className="space-y-8">
//                   <div className="space-y-6">
//                     <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
//                       Personal Information
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Student Name
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={traineeFormData.name}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Father's Name
//                         </label>
//                         <input
//                           type="text"
//                           name="father"
//                           value={traineeFormData.father}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Phone
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={traineeFormData.phone}
//                           onChange={handleTraineeInputChange}
//                           pattern="^[0-9]{10}$"
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Date of Birth
//                         </label>
//                         <div className="flex items-center gap-4">
//                           <input
//                             type="date"
//                             name="dob"
//                             value={traineeFormData.dob}
//                             onChange={handleTraineeInputChange}
//                             className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           />
//                           {traineeFormData.dob && (
//                             <p className="text-sm text-gray-500 whitespace-nowrap">
//                               Age: {calculateAge(traineeFormData.dob)} years
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-6">
//                     <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
//                       Contact & Education
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <div className="sm:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Address
//                         </label>
//                         <textarea
//                           name="address"
//                           value={traineeFormData.address}
//                           onChange={handleTraineeInputChange}
//                           rows={3}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           School Name
//                         </label>
//                         <input
//                           type="text"
//                           name="name_of_school"
//                           value={traineeFormData.name_of_school}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Current Class
//                         </label>
//                         <input
//                           type="text"
//                           name="current_class"
//                           value={traineeFormData.current_class}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Father's Occupation
//                         </label>
//                         <input
//                           type="text"
//                           name="occupation"
//                           value={traineeFormData.occupation}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-6">
//                     <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
//                       Documents
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Student Photo{" "}
//                           <span className="text-sm text-gray-500">
//                             (Max 50KB)
//                           </span>
//                         </label>
//                         <input
//                           type="file"
//                           onChange={(e) => handleFileChange(e, "photo")}
//                           accept="image/*"
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Student Signature{" "}
//                           <span className="text-sm text-gray-500">
//                             (Max 50KB)
//                           </span>
//                         </label>
//                         <input
//                           type="file"
//                           onChange={(e) =>
//                             handleFileChange(e, "traineeSignature")
//                           }
//                           accept="image/*"
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Father's Signature{" "}
//                           <span className="text-sm text-gray-500">
//                             (Max 50KB)
//                           </span>
//                         </label>
//                         <input
//                           type="file"
//                           onChange={(e) =>
//                             handleFileChange(e, "fatherSignature")
//                           }
//                           accept="image/*"
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-6">
//                     <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
//                       Plan & Payment Details
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Select Institute
//                         </label>
//                         <select
//                           name="institute_id"
//                           value={traineeFormData.institute_id}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                         >
//                           <option value="" disabled>
//                             Select an institute
//                           </option>
//                           {institutes.map((institute) => (
//                             <option key={institute._id} value={institute._id}>
//                               {institute.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Select Sport
//                         </label>
//                         <select
//                           name="sport_id"
//                           value={traineeFormData.sport_id}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                           disabled={!traineeFormData.institute_id}
//                         >
//                           <option value="">Select a sport</option>
//                           {sports.map((sport) => (
//                             <option key={sport._id} value={sport._id}>
//                               {sport.name}
//                             </option>
//                           ))}
//                         </select>
//                         {!traineeFormData.sport_id && (
//                           <p className="text-sm text-gray-500 mt-1">
//                             Please select a Institute first
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Select Batch
//                           </label>
//                           <select
//                             name="batch_id"
//                             value={traineeFormData.batch_id}
//                             onChange={handleTraineeInputChange}
//                             className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                             required
//                             disabled={!traineeFormData.sport_id}
//                           >
//                             <option value="">Select a batch</option>
//                             {getFilteredBatches(traineeFormData.sport_id).map((batch) => (
//                               <option key={batch._id} value={batch._id}>
//                                 {batch.name} ({formatTime(batch.start_time)} - {formatTime(batch.end_time)})
//                               </option>
//                             ))}
//                           </select>
//                           {!traineeFormData.sport_id && (
//                             <p className="text-sm text-gray-500 mt-1">
//                               Please select a sport first
//                             </p>
//                           )}
//                         </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Plan Selection
//                         </label>
//                         <select
//                           name="plan_id"
//                           value={traineeFormData.plan_id}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                           disabled={!traineeFormData.batch_id}
//                         >
//                           <option value="">Select a plan</option>
//                           {plans.map((plan) => (
//                             <option key={plan._id} value={plan._id}>
//                               {plan.name}
//                             </option>
//                           ))}
//                         </select>
//                         {!traineeFormData.batch_id && (
//                           <p className="text-sm text-gray-500 mt-1">
//                             Please select a batch first
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Payment Method
//                         </label>
//                         <select
//                           name="method"
//                           value={traineeFormData.method}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                         >
//                           <option value="">Select Payment Method</option>
//                           <option value="CASH">Cash</option>
//                           <option value="UPI">Online</option>
//                           <option value="CARD">Card</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Amount
//                         </label>
//                         <input
//                           type="number"
//                           name="amount"
//                           value={traineeFormData.amount}
//                           onChange={handleTraineeInputChange}
//                           onWheel={(e) => e.target.blur()}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Start Date
//                         </label>
//                         <input
//                           type="date"
//                           name="start_date"
//                           value={traineeFormData.start_date}
//                           onChange={handleTraineeInputChange}
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Expiry Date
//                         </label>
//                         <input
//                           type="date"
//                           name="expiry_date"
//                           value={traineeFormData.expiry_date}
//                           // onChange={handleTraineeInputChange}
//                           readOnly
//                           className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-4 pt-4 border-t">
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     {/* <button
//                       type="submit"
//                       className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
//                     >
//                       {editingTrainee
//                         ? "Update Student"
//                         : "Add Student"}
//                     </button> */}
//                     <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors ${
//                           isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//                       >
//                         {isSubmitting
//                           ? "Processing..."
//                           : editingTrainee
//                           ? "Update Student"
//                           : "Add Student"}
//                       </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showRenewalPopup && (
//         <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl h-auto max-h-[90%] overflow-y-auto mx-auto">
//             <h3 className="text-2xl font-semibold mb-6 text-center">
//               Renew Membership
//             </h3>
//             <form onSubmit={handleRenewalSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Student Name
//                 </label>
//                 <input
//                   type="text"
//                   value={renewalFormData.name}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Roll Number
//                 </label>
//                 <input
//                   type="text"
//                   value={renewalFormData.roll_no}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Select Sport
//                 </label>
//                 <select
//                   name="sport_id"
//                   value={renewalFormData.sport_id}
//                   onChange={handleRenewalInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="">Select a sport</option>
//                   {sports.map((sport) => (
//                     <option key={sport._id} value={sport._id}>
//                       {sport.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Select Batch
//                 </label>
//                 <select
//                   name="batch_id"
//                   value={renewalFormData.batch_id}
//                   onChange={handleRenewalInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                   disabled={!renewalFormData.sport_id}
//                 >
//                   <option value="">Select a batch</option>
//                   {getFilteredBatches(renewalFormData.sport_id).map((batch) => (
//                     <option key={batch._id} value={batch._id}>
//                       {batch.name} ({batch.start_time} - {batch.end_time})
//                     </option>
//                   ))}
//                 </select>
//                 {!renewalFormData.sport_id && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     Please select a sport first
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Select Institute
//                 </label>
//                 <select
//                   name="institute_id"
//                   value={renewalFormData.institute_id}
//                   onChange={handleRenewalInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="">Select an institute</option>
//                   {institutes.map((institute) => (
//                     <option key={institute._id} value={institute._id}>
//                       {institute.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Plan Selection
//                 </label>
//                 <select
//                   name="plan_id"
//                   value={renewalFormData.plan_id}
//                   onChange={handleRenewalInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="">Select a plan</option>
//                   {plans.map((plan) => (
//                     <option key={plan._id} value={plan._id}>
//                       {plan.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Amount
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={renewalFormData.amount}
//                   onChange={handleRenewalInputChange}
//                   onWheel={(e) => e.target.blur()}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Payment Method
//                 </label>
//                 <select
//                   name="method"
//                   value={renewalFormData.method}
//                   onChange={handleRenewalInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="" disabled>
//                     Select Payment Method
//                   </option>
//                   <option value="CASH">Cash</option>
//                   <option value="UPI">UPI</option>
//                   <option value="CARD">Card</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   name="start_date"
//                   value={renewalFormData.start_date}
//                   onChange={handleRenewalInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Expiry Date
//                 </label>
//                 <input
//                   type="date"
//                   name="expiry_date"
//                   value={renewalFormData.expiry_date}
//                   // onChange={handleRenewalInputChange}
//                   readOnly
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//                   <p className="text-red-700 text-sm">{error}</p>
//                 </div>
//               )}
//               <div className="flex justify-end mt-6 space-x-4">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                   onClick={handleCancel}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Submit Renewal
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const DetailItem = ({ label, value }) => (
//   <div className="p-3 bg-gray-50 rounded-lg">
//     <span className="text-sm text-gray-600">{label}</span>
//     <p className="font-medium text-gray-900">{value}</p>
//   </div>
// );

// export default TraineeManagement;


import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import imageCompression from "browser-image-compression";
import {
  Search,
  Plus,
  Edit2,
  Eye,
  RefreshCw,
  Trash2,
  X,
  Filter,
  FileSpreadsheet,
  Download,
  DollarSign,
} from "lucide-react";
import jsPDF from "jspdf";

const TraineeManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [trainees, setTrainees] = useState([]);
  const [plans, setPlans] = useState([]);
  const [sports, setSports] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showTraineePopup, setShowTraineePopup] = useState(false);
  const [showRenewalPopup, setShowRenewalPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [error, setError] = useState("");
  const [renewalFormData, setRenewalFormData] = useState({
    trainee_id: "",
    name: "",
    roll_no: "",
    plan_id: "",
    amount: 0,
    method: "",
    institute_id: "",
    sport_id: "",
    batch_id: "",
    start_date: moment().format("YYYY-MM-DD"),
    expiry_date: "",
  });
  const [traineeFormData, setTraineeFormData] = useState({
    name: "",
    father: "",
    dob: moment().format("YYYY-MM-DD"),
    address: "",
    phone: "",
    plan_id: "",
    sport_id: "",
    institute_id: "",
    batch_id: "",
    active: true,
    photo: null,
    fatherSignature: null,
    occupation: "",
    current_class: "",
    name_of_school: "",
    traineeSignature: null,
    dateAndPlace: "",
    amount: 0,
    method: "",
    payment_status: "PENDING",
    initial_payment: 0,
    start_date: moment().format("YYYY-MM-DD"),
    expiry_date: "",
  });
  const [paymentFormData, setPaymentFormData] = useState({
    trainee_id: "",
    payment_amount: 0,
    payment_method: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [selectedSport, setSelectedSport] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userid")}`,
    },
  });

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchTrainees();
    fetchPlans();
    fetchSports();
    fetchInstitutes();
    fetchBatches();
  }, []);

  const handleDownloadReceipt = async (data) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const colors = {
        primary: "#007e13",
        secondary: "#dbfee5",
        text: "#1F2937",
        muted: "#6B7280",
        success: "#059669",
        border: "#E5E7EB",
      };

      const trainee = {
        name: data.name || "N/A",
        phone: data.phone || data.roll_no || "N/A",
        sport_id: data.sport_id || "",
        batch_id: data.batch_id || "",
        plan_id: data.plan_id || "",
        amount: data.amount || 0,
        method: data.method || "N/A",
        from: data.start_date || data.from || "",
        to: data.expiry_date || data.to || "",
      };

      doc.setFillColor("#FFFFFF");
      doc.rect(0, 0, 595.28, 120, "F");

      const logoUrl = "/logo.jpg";
      try {
        const logoImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = logoUrl;
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load logo"));
        });
        doc.addImage(logoImg, "JPEG", 40, 20, 120, 0);
      } catch (err) {
        console.warn("Failed to load logo:", err);
        doc.setFontSize(10);
        doc.setTextColor(colors.muted);
        doc.text("Logo not available", 40, 30);
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text);
      doc.text("KAVYA SPORTS ACADEMY", 40, 150);
      doc.setFontSize(10);
      doc.setTextColor(colors.muted);
      doc.text("+91 94292 67077", 40, 165);
      doc.text(
        "FP-9, Opp. Diamond 27, Nr. Kadi Nagrik Bank, TP 69, New Chandkheda, Ahmedabad-382424",
        40,
        180,
        { maxWidth: 200 }
      );

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.primary);
      doc.text("PAYMENT RECEIPT", 572, 40, { align: "right" });

      doc.setLineWidth(1);
      doc.setDrawColor(colors.border);
      doc.line(40, 220, 572, 220);

      const receiptDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.muted);
      doc.text(`Date: ${receiptDate}`, 40, 240);

      doc.setFontSize(14);
      doc.setTextColor(colors.primary);
      doc.text("Student Details:", 40, 280);
      doc.setFontSize(11);
      doc.setTextColor(colors.text);
      doc.text(`Name: ${trainee.name}`, 40, 305);
      doc.text(`Mobile: ${trainee.phone}`, 40, 325);

      const tableTop = 350;

      doc.setFillColor(colors.primary);
      doc.rect(40, tableTop, 532, 30, "F");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("No.", 50, tableTop + 10);
      doc.text("Sport Name", 80, tableTop + 10);
      doc.text("Slot & Timing", 200, tableTop + 10);
      doc.text("Selected Plan", 330, tableTop + 10);
      doc.text("Amount", 492, tableTop + 10, { align: "right" });

      const rowY = tableTop + 32;
      doc.setFillColor(colors.secondary);
      doc.rect(40, rowY, 532, 30, "F");

      const sportName = getSportName(trainee.sport_id) || "N/A";
      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      doc.text("1", 50, rowY + 10);
      doc.text(sportName, 80, rowY + 10, { maxWidth: 110 });

      const batch = batches.find((b) => b._id === trainee.batch_id);
      const slotTiming = batch ? batch.name : "N/A";
      const slotTimeDetails = batch ? `(${formatTime(batch.start_time)} - ${formatTime(batch.end_time)})` : "";
      doc.setFontSize(10);
      doc.text(slotTiming, 200, rowY + 10, { maxWidth: 120 });
      doc.setFontSize(8);
      doc.text(slotTimeDetails, 200, rowY + 22, { maxWidth: 120 });

      const plan = plans.find((p) => p._id === trainee.plan_id);
      const planTiming = plan ? plan.name : "N/A";
      const planDateDetails =
        trainee.from && trainee.to
          ? `(${formatDate(trainee.from)} - ${formatDate(trainee.to)})`
          : "";
      doc.setFontSize(10);
      doc.text(planTiming, 330, rowY + 10, { maxWidth: 150 });
      doc.setFontSize(8);
      doc.text(planDateDetails, 330, rowY + 22, { maxWidth: 150 });

      doc.setFontSize(10);
      doc.text(
        trainee.amount ? `Rs. ${trainee.amount}` : "N/A",
        492,
        rowY + 10,
        { align: "right" }
      );

      const totalY = rowY + 50;
      doc.setFontSize(12);
      doc.setTextColor(colors.primary);
      doc.text("Total Amount:", 370, totalY);
      doc.setFontSize(14);
      doc.setTextColor(colors.text);
      doc.text(
        trainee.amount ? `Rs. ${trainee.amount}` : "N/A",
        510,
        totalY,
        { align: "right" }
      );

      const paymentY = totalY + 50;
      doc.setLineWidth(0.5);
      doc.setDrawColor(colors.border);
      doc.line(40, paymentY, 572, paymentY);
      doc.setFontSize(12);
      doc.setTextColor(colors.primary);
      doc.text("Payment Details:", 40, paymentY + 15);
      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      doc.text(`Method: ${trainee.method === "UPI" ? "ONLINE" : trainee.method || "N/A"}`, 40, paymentY + 35);
      doc.text("Status: Paid", 40, paymentY + 55);
      doc.setTextColor(colors.success);

      doc.setFontSize(8);
      doc.setTextColor(colors.muted);
      doc.text(
        "This is a computer-generated receipt. No signature required.",
        297.5,
        750,
        { align: "center" }
      );

      doc.save(`Receipt_${trainee.name}.pdf`);
    } catch (error) {
      console.error("Error generating receipt:", error);
      setError("Failed to generate receipt. Please try again.");
    }
  };

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(`${ip}/api/academy/trainees`);
      const normalizedTrainees = response.data.map((trainee) => ({
        ...trainee,
        start_date: trainee.from || trainee.start_date,
        expiry_date: trainee.to || trainee.expiry_date,
      }));
      setTrainees(normalizedTrainees);
    } catch (error) {
      console.error("Error fetching Students:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch Students. Please try again."
      );
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await axiosInstance.post(
        `${ip}/api/academy/active-plans`
      );
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to fetch plans. Please try again.");
    }
  };

  const fetchSports = async () => {
    try {
      const response = await axios.post(`${ip}/api/academy/all-sports`, {
        userId: localStorage.getItem("userid"),
      });
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports:", error);
      setError("Failed to fetch sports. Please try again.");
    }
  };

  const fetchInstitutes = async () => {
    try {
      const response = await axios.post(`${ip}/api/academy/all-institutes`, {
        userId: localStorage.getItem("userid"),
      });
      setInstitutes(response.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setError("Failed to fetch institutes. Please try again.");
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.post(`${ip}/api/academy/all-batches`, {
        userId: localStorage.getItem("userid"),
      });
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setError("Failed to fetch batches. Please try again.");
    }
  };

  const getSportName = (sportId) => {
    const sport = sports.find((s) => s._id === sportId);
    return sport ? sport.name : sportId || "N/A";
  };

  const getInstituteName = (instituteId) => {
    const institute = institutes.find((i) => i._id === instituteId);
    return institute ? institute.name : instituteId || "N/A";
  };

  const getBatchName = (batchId) => {
    const batch = batches.find((b) => b._id === batchId);
    return batch
      ? `${batch.name} (${formatTime(batch.start_time)} - ${formatTime(batch.end_time)})`
      : batchId || "N/A";
  };

  const getFilteredBatches = (sportId) => {
    if (!sportId) return [];
    return batches.filter(
      (batch) => batch.sport_id && batch.sport_id._id === sportId
    );
  };

  const compressImage = async (file) => {
    if (!file) return null;
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, { type: file.type });
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to compress image. Please try again.");
      return null;
    }
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedFile = await compressImage(file);
      if (compressedFile) {
        setTraineeFormData({ ...traineeFormData, [field]: compressedFile });
        setError("");
      }
    } catch (error) {
      console.error("Error handling file:", error);
      setError("Failed to process image. Please try again.");
    }
  };

  const calculateTraineeExpiryDate = (planId, startDate) => {
    if (!planId || !startDate) return "";
    const selectedPlan = plans.find((plan) => plan._id === planId);
    if (!selectedPlan || !selectedPlan.plan_limit) return "";
    const expiryDate = moment(startDate)
      .add(selectedPlan.plan_limit, "days")
      .format("YYYY-MM-DD");
    return expiryDate;
  };

  const handleTraineeInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...traineeFormData, [name]: value };

    if (name === "sport_id") {
      updatedFormData.batch_id = "";
    } else if (name === "plan_id") {
      const selectedPlan = plans.find((plan) => plan._id === value);
      const expiryDate = calculateTraineeExpiryDate(
        value,
        traineeFormData.start_date
      );
      updatedFormData.amount = selectedPlan ? selectedPlan.amount : 0;
      updatedFormData.initial_payment = updatedFormData.payment_status === "PAID" ? updatedFormData.amount : 0;
      updatedFormData.expiry_date = expiryDate;
    } else if (name === "start_date") {
      const expiryDate = calculateTraineeExpiryDate(
        traineeFormData.plan_id,
        value
      );
      updatedFormData.expiry_date = expiryDate;
    } else if (name === "payment_status") {
      updatedFormData.initial_payment = value === "PAID" ? updatedFormData.amount : value === "PENDING" ? 0 : updatedFormData.initial_payment;
    }

    setTraineeFormData(updatedFormData);
  };

  const handleRenewalInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...renewalFormData, [name]: value };

    if (name === "sport_id") {
      updatedFormData.batch_id = "";
    } else if (name === "plan_id") {
      const selectedPlan = plans.find((plan) => plan._id === value);
      const expiryDate = calculateTraineeExpiryDate(
        value,
        renewalFormData.start_date
      );
      updatedFormData.amount = selectedPlan ? selectedPlan.amount : 0;
      updatedFormData.expiry_date = expiryDate;
    } else if (name === "start_date") {
      const expiryDate = calculateTraineeExpiryDate(
        renewalFormData.plan_id,
        value
      );
      updatedFormData.expiry_date = expiryDate;
    }

    setRenewalFormData(updatedFormData);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData({ ...paymentFormData, [name]: value });
  };

  const handleTraineeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!traineeFormData.sport_id) {
      setError("Please select a sport.");
      setIsSubmitting(false);
      return;
    }

    if (!traineeFormData.batch_id) {
      setError("Please select a batch.");
      setIsSubmitting(false);
      return;
    }

    if (!traineeFormData.institute_id) {
      setError("Please select an institute.");
      setIsSubmitting(false);
      return;
    }

    if (traineeFormData.payment_status === "PARTIAL" && (!traineeFormData.initial_payment || traineeFormData.initial_payment <= 0 || traineeFormData.initial_payment >= traineeFormData.amount)) {
      setError("Initial payment must be greater than 0 and less than total amount for PARTIAL status.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.keys(traineeFormData).forEach((key) => {
      if (
        key === "photo" ||
        key === "traineeSignature" ||
        key === "fatherSignature"
      ) {
        if (traineeFormData[key]) {
          formData.append(key, traineeFormData[key]);
        }
      } else {
        formData.append(key, traineeFormData[key]);
      }
    });

    try {
      const userId = localStorage.getItem("userid");
      if (!userId) {
        setError("User not authenticated. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userId}`,
          "Content-Type": "multipart/form-data",
        },
      };
      let response;
      if (editingTrainee) {
        response = await axios.put(
          `${ip}/api/manager/update-trainee/${editingTrainee._id}`,
          formData,
          config
        );
      } else {
        response = await Promise.race([
          axios.post(`${ip}/api/manager/add-new-trainee`, formData, config),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("API call timed out")), 10000)
          ),
        ]);
      }

      if (response.status === 200) {
        await fetchTrainees();
        setShowTraineePopup(false);
        setEditingTrainee(null);
        setTraineeFormData({
          name: "",
          father: "",
          dob: moment().format("YYYY-MM-DD"),
          address: "",
          phone: "",
          plan_id: "",
          sport_id: "",
          institute_id: institutes.length > 0 ? institutes[0]._id : "",
          batch_id: "",
          active: true,
          photo: null,
          fatherSignature: null,
          occupation: "",
          current_class: "",
          name_of_school: "",
          traineeSignature: null,
          dateAndPlace: "",
          amount: 0,
          method: "",
          payment_status: "PENDING",
          initial_payment: 0,
          start_date: moment().format("YYYY-MM-DD"),
          expiry_date: "",
        });
        setError("");
      }
    } catch (error) {
      console.error("Error in handleTraineeSubmit:", error);
      let errorMessage = "Failed to submit Student data. Please try again.";
      if (error.response && error.response.data) {
        if (error.response.data instanceof Blob) {
          const errorText = await error.response.data.text();
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setError(errorMessage);
      setShowTraineePopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!paymentFormData.payment_amount || paymentFormData.payment_amount <= 0) {
      setError("Payment amount must be greater than 0.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userid");
      if (!userId) {
        setError("User not authenticated. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      };

      const response = await axios.post(
        `${ip}/api/manager/add-partial-payment`,
        paymentFormData,
        config
      );

      if (response.status === 200) {
        await fetchTrainees();
        setShowPaymentPopup(false);
        setPaymentFormData({
          trainee_id: "",
          payment_amount: 0,
          payment_method: "",
        });
        setError("");
        alert("Partial payment added successfully!");
      }
    } catch (error) {
      console.error("Error submitting payment data:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit payment data. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (institutes.length > 0 && !traineeFormData.institute_id) {
      setTraineeFormData((prev) => ({
        ...prev,
        institute_id: institutes[0]._id,
      }));
    }
  }, [institutes]);

  const handleRenewalSubmit = async (e) => {
    e.preventDefault();
    if (!renewalFormData.sport_id) {
      setError("Please select a sport.");
      return;
    }
    if (!renewalFormData.batch_id) {
      setError("Please select a batch.");
      return;
    }
    try {
      const userId = localStorage.getItem("userid");
      if (!userId) {
        setError("User not authenticated. Please login again.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      };

      await axios.post(
        `${ip}/api/academy/renewal`,
        renewalFormData,
        config
      );

      const pdfData = {
        name: renewalFormData.name,
        roll_no: renewalFormData.roll_no,
        sport_id: renewalFormData.sport_id,
        batch_id: renewalFormData.batch_id,
        plan_id: renewalFormData.plan_id,
        amount: renewalFormData.amount,
        method: renewalFormData.method,
        start_date: renewalFormData.start_date,
        expiry_date: renewalFormData.expiry_date,
      };

      await handleDownloadReceipt(pdfData);

      await fetchTrainees();
      setShowRenewalPopup(false);
      setRenewalFormData({
        trainee_id: "",
        name: "",
        roll_no: "",
        plan_id: "",
        amount: 0,
        method: "",
        institute_id: "",
        sport_id: "",
        batch_id: "",
        start_date: moment().format("YYYY-MM-DD"),
        expiry_date: "",
      });
      setError("");
      alert("Membership renewed successfully!");
    } catch (error) {
      console.error("Error submitting renewal data:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit renewal data. Please check your inputs and try again.";
      setError(errorMessage);
    }
  };

  const openTraineePopup = (trainee = null) => {
    setEditingTrainee(trainee);
    setTraineeFormData(
      trainee
        ? {
            ...trainee,
            dob: trainee.dob
              ? moment(trainee.dob).format("YYYY-MM-DD")
              : moment().format("YYYY-MM-DD"),
            start_date: trainee.from
              ? moment(trainee.from).format("YYYY-MM-DD")
              : moment().format("YYYY-MM-DD"),
            expiry_date: trainee.to
              ? moment(trainee.to).format("YYYY-MM-DD")
              : "",
            sport_id: trainee.sport_id || "",
            institute_id: trainee.institute_id || "",
            batch_id: trainee.batch_id || "",
            plan_id: trainee.plan_id || "",
            photo: null,
            traineeSignature: null,
            fatherSignature: null,
            payment_status: trainee.payment_status || "PENDING",
            initial_payment: trainee.payment_status === "PAID" ? trainee.amount : trainee.initial_payment || 0,
          }
        : {
            name: "",
            father: "",
            dob: moment().format("YYYY-MM-DD"),
            address: "",
            phone: "",
            plan_id: "",
            sport_id: "",
            institute_id: "",
            batch_id: "",
            active: true,
            photo: null,
            fatherSignature: null,
            occupation: "",
            current_class: "",
            name_of_school: "",
            traineeSignature: null,
            dateAndPlace: "",
            amount: 0,
            method: "",
            payment_status: "PENDING",
            initial_payment: 0,
            start_date: moment().format("YYYY-MM-DD"),
            expiry_date: "",
          }
    );
    setShowTraineePopup(true);
  };

  const openRenewalPopup = (trainee) => {
    const startDate = moment().format("YYYY-MM-DD");
    const expiryDate = calculateTraineeExpiryDate(trainee.plan_id, startDate);
    setRenewalFormData({
      trainee_id: trainee._id,
      name: trainee.name,
      roll_no: trainee.roll_no,
      plan_id: trainee.plan_id || "",
      amount: trainee.amount || 0,
      method: "",
      institute_id: trainee.institute_id || "",
      sport_id: trainee.sport_id || "",
      batch_id: trainee.batch_id || "",
      start_date: startDate,
      expiry_date: expiryDate,
    });
    setShowRenewalPopup(true);
  };

  const openPaymentPopup = (trainee) => {
    setPaymentFormData({
      trainee_id: trainee._id,
      payment_amount: 0,
      payment_method: "",
    });
    setShowPaymentPopup(true);
  };

  const handleCancel = () => {
    setShowTraineePopup(false);
    setShowRenewalPopup(false);
    setShowPaymentPopup(false);
    setError("");
  };

  const isRenewalAllowed = (expiryDate) => {
    const today = moment();
    const expiry = moment(expiryDate);
    const daysUntilExpiry = expiry.diff(today, "days");
    return daysUntilExpiry <= 3 && daysUntilExpiry >= -36500;
  };

  const handleDeleteTrainee = async (id) => {
    try {
      const userId = localStorage.getItem("userid");
      if (!userId) {
        setError("User not authenticated. Please login again.");
        return;
      }

      await axiosInstance.post(`${ip}/api/manager/delete-trainee`, {
        id,
        userid: userId,
      });
      fetchTrainees();
    } catch (error) {
      console.error("Error deleting Student:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete Student. Please try again."
      );
    }
  };

  const exportToExcel = () => {
    if (trainees.length === 0) {
      alert("No Student data available for export.");
      return;
    }
    const excelData = trainees.map((trainee) => ({
      Name: trainee.name,
      "Father's Name": trainee.father,
      Phone: trainee.phone,
      DOB: moment(trainee.dob).format("DD-MM-YYYY"),
      Address: trainee.address,
      Plan: trainee.plan_id,
      Sport: getSportName(trainee.sport_id),
      Institute: getInstituteName(trainee.institute_id),
      Batch: getBatchName(trainee.batch_id),
      "Start Date": moment(trainee.start_date).format("DD-MM-YYYY"),
      "Expiry Date": moment(trainee.expiry_date).format("DD-MM-YYYY"),
      "Total Amount": `₹${trainee.amount}`,
      "Payment Status": trainee.payment_status,
      "Pending Amount": `₹${trainee.pending_amount || 0}`,
      Active: trainee.active ? "Yes" : "No",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `Student_Data_${moment().format("YYYY-MM-DD")}.xlsx`);
  };

  const handleViewTrainee = (trainee) => {
    setSelectedTrainee(trainee);
  };

  const handleClosePopup = () => {
    setSelectedTrainee(null);
  };

  const filteredTrainees = useMemo(() => {
    return trainees.filter((trainee) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        trainee.name.toLowerCase().includes(searchLower) ||
        trainee.roll_no.toLowerCase().includes(searchLower);

      const today = moment();
      const isExpired = moment(trainee.to).isBefore(today, "day");
      const isActive = !isExpired;

      let matchesMembershipFilter = true;
      if (membershipFilter === "expired") {
        matchesMembershipFilter = isExpired;
      } else if (membershipFilter === "active") {
        matchesMembershipFilter = isActive;
      } else if (membershipFilter === "paid") {
        matchesMembershipFilter = trainee.payment_status === "PAID";
      } else if (membershipFilter === "partial") {
        matchesMembershipFilter = trainee.payment_status === "PARTIAL";
      }

      const matchesSportFilter =
        selectedSport === "all" || trainee.sport_id === selectedSport;

      return matchesSearch && matchesMembershipFilter && matchesSportFilter;
    });
  }, [trainees, searchQuery, membershipFilter, selectedSport]);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-base text-gray-900">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-0 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Student Management ({filteredTrainees.length})
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Memberships</option>
              <option value="expired">Expired Memberships</option>
              <option value="active">Active Memberships</option>
              <option value="paid">Paid Students</option>
              <option value="partial">Partial Payment Students</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Sports</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={exportToExcel}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base"
          >
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Excel
          </button>
          <button
            onClick={() => openTraineePopup()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredTrainees.map((trainee) => (
          <div
            key={trainee._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="flex items-start p-4 gap-4">
              <div className="flex-shrink-0">
                <img
                  src={`${ip}/Uploads/${trainee.photo}`}
                  alt={trainee.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onClick={() => handleViewTrainee(trainee)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {trainee.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Roll No:{" "}
                  <span className="font-medium">{trainee.roll_no}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Sport:{" "}
                  <span className="font-medium">
                    {getSportName(trainee.sport_id)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Institute:{" "}
                  <span className="font-medium">
                    {getInstituteName(trainee.institute_id)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Batch:{" "}
                  <span className="font-medium">
                    {getBatchName(trainee.batch_id)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Expires:{" "}
                  <span className="font-medium">
                    {formatDate(trainee.to)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Payment Status:{" "}
                  <span className={`font-medium ${trainee.payment_status === 'PAID' ? 'text-green-600' : trainee.payment_status === 'PARTIAL' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {trainee.payment_status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Pending Amount:{" "}
                  <span className="font-medium">
                    ₹{trainee.pending_amount || 0}
                  </span>
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end gap-2">
              <button
                onClick={() => openTraineePopup(trainee)}
                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewTrainee(trainee)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </button>
              {isRenewalAllowed(trainee.to) && (
                <button
                  onClick={() => openRenewalPopup(trainee)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Renew Membership"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDownloadReceipt(trainee)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="Download Receipt"
              >
                <Download className="w-5 h-5" />
              </button>
              {(trainee.payment_status === "PARTIAL" || trainee.payment_status === "PENDING") && (
                <button
                  onClick={() => openPaymentPopup(trainee)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Add Partial Payment"
                >
                  <DollarSign className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDeleteTrainee(trainee._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTrainee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Student Details
                </h2>
                <button
                  onClick={handleClosePopup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-2">
                    Student Photo
                  </span>
                  <img
                    src={`${ip}/Uploads/${selectedTrainee.photo}`}
                    alt="Student"
                    className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-2">
                    Student's Signature
                  </span>
                  <img
                    src={`${ip}/Uploads/${selectedTrainee.signature}`}
                    alt="Student Signature"
                    className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-2">
                    Father's Signature
                  </span>
                  <img
                    src={`${ip}/Uploads/${selectedTrainee.father_signature}`}
                    alt="Father's Signature"
                    className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Name" value={selectedTrainee.name} />
                <DetailItem label="Roll No" value={selectedTrainee.roll_no} />
                <DetailItem
                  label="Father's Name"
                  value={selectedTrainee.father}
                />
                <DetailItem label="Phone" value={selectedTrainee.phone} />
                <DetailItem
                  label="Start Date"
                  value={formatDate(selectedTrainee.from)}
                />
                <DetailItem
                  label="Expiry Date"
                  value={formatDate(selectedTrainee.to)}
                />
                <DetailItem
                  label="Total Amount"
                  value={`₹${selectedTrainee.amount}`}
                />
                <DetailItem
                  label="Payment Status"
                  value={selectedTrainee.payment_status}
                />
                <DetailItem
                  label="Pending Amount"
                  value={`₹${selectedTrainee.pending_amount || 0}`}
                />
                <DetailItem
                  label="Father's Occupation"
                  value={selectedTrainee.occupation}
                />
                <DetailItem
                  label="Sport"
                  value={getSportName(selectedTrainee.sport_id)}
                />
                <DetailItem
                  label="Institute"
                  value={getInstituteName(selectedTrainee.institute_id)}
                />
                <DetailItem
                  label="Batch"
                  value={getBatchName(selectedTrainee.batch_id)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showTraineePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative">
              <button
                onClick={handleCancel}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
                  {editingTrainee ? "Edit Student" : "Add New Student"}
                </h3>
                <form onSubmit={handleTraineeSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={traineeFormData.name}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          name="father"
                          value={traineeFormData.father}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={traineeFormData.phone}
                          onChange={handleTraineeInputChange}
                          pattern="^[0-9]{10}$"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="date"
                            name="dob"
                            value={traineeFormData.dob}
                            onChange={handleTraineeInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          {traineeFormData.dob && (
                            <p className="text-sm text-gray-500 whitespace-nowrap">
                              Age: {calculateAge(traineeFormData.dob)} years
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Contact & Education
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={traineeFormData.address}
                          onChange={handleTraineeInputChange}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          School Name
                        </label>
                        <input
                          type="text"
                          name="name_of_school"
                          value={traineeFormData.name_of_school}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Class
                        </label>
                        <input
                          type="text"
                          name="current_class"
                          value={traineeFormData.current_class}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Father's Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={traineeFormData.occupation}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Photo{" "}
                          <span className="text-sm text-gray-500">
                            (Max 50KB)
                          </span>
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "photo")}
                          accept="image/*"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Signature{" "}
                          <span className="text-sm text-gray-500">
                            (Max 50KB)
                          </span>
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, "traineeSignature")
                          }
                          accept="image/*"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Father's Signature{" "}
                          <span className="text-sm text-gray-500">
                            (Max 50KB)
                          </span>
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, "fatherSignature")
                          }
                          accept="image/*"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Plan & Payment Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institute
                        </label>
                        <select
                          name="institute_id"
                          value={traineeFormData.institute_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Institute</option>
                          {institutes.map((institute) => (
                            <option key={institute._id} value={institute._id}>
                              {institute.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sport
                        </label>
                        <select
                          name="sport_id"
                          value={traineeFormData.sport_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Sport</option>
                          {sports.map((sport) => (
                            <option key={sport._id} value={sport._id}>
                              {sport.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Batch
                        </label>
                        <select
                          name="batch_id"
                          value={traineeFormData.batch_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Batch</option>
                          {getFilteredBatches(traineeFormData.sport_id).map((batch) => (
                            <option key={batch._id} value={batch._id}>
                              {batch.name} ({formatTime(batch.start_time)} - {formatTime(batch.end_time)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan
                        </label>
                        <select
                          name="plan_id"
                          value={traineeFormData.plan_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Plan</option>
                          {plans.map((plan) => (
                            <option key={plan._id} value={plan._id}>
                              {plan.name} (₹{plan.amount})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={traineeFormData.start_date}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiry_date"
                          value={traineeFormData.expiry_date}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Amount
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={traineeFormData.amount}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Status
                        </label>
                        <select
                          name="payment_status"
                          value={traineeFormData.payment_status}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PARTIAL">Partial</option>
                          <option value="PAID">Paid</option>
                        </select>
                      </div>
                      {traineeFormData.payment_status === "PARTIAL" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Payment
                          </label>
                          <input
                            type="number"
                            name="initial_payment"
                            value={traineeFormData.initial_payment}
                            onChange={handleTraineeInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            min="1"
                            max={traineeFormData.amount - 1}
                            required
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select
                          name="method"
                          value={traineeFormData.method}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required={traineeFormData.payment_status !== "PENDING"}
                        >
                          <option value="">Select Method</option>
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="CARD">Card</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2.5 rounded-lg text-white transition-colors ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : editingTrainee
                        ? "Update Student"
                        : "Add Student"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenewalPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative">
              <button
                onClick={handleCancel}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
                  Renew Membership
                </h3>
                <form onSubmit={handleRenewalSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={renewalFormData.name}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Roll No
                      </label>
                      <input
                        type="text"
                        value={renewalFormData.roll_no}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institute
                      </label>
                      <select
                        name="institute_id"
                        value={renewalFormData.institute_id}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Institute</option>
                        {institutes.map((institute) => (
                          <option key={institute._id} value={institute._id}>
                            {institute.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sport
                      </label>
                      <select
                        name="sport_id"
                        value={renewalFormData.sport_id}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Sport</option>
                        {sports.map((sport) => (
                          <option key={sport._id} value={sport._id}>
                            {sport.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch
                      </label>
                      <select
                        name="batch_id"
                        value={renewalFormData.batch_id}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Batch</option>
                        {getFilteredBatches(renewalFormData.sport_id).map((batch) => (
                          <option key={batch._id} value={batch._id}>
                            {batch.name} ({formatTime(batch.start_time)} - {formatTime(batch.end_time)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan
                      </label>
                      <select
                        name="plan_id"
                        value={renewalFormData.plan_id}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Plan</option>
                        {plans.map((plan) => (
                          <option key={plan._id} value={plan._id}>
                            {plan.name} (₹{plan.amount})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={renewalFormData.start_date}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={renewalFormData.expiry_date}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={renewalFormData.amount}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        name="method"
                        value={renewalFormData.method}
                        onChange={handleRenewalInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Renew Membership
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
              <button
                onClick={handleCancel}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
                  Add Partial Payment
                </h3>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Amount
                    </label>
                    <input
                      type="number"
                      name="payment_amount"
                      value={paymentFormData.payment_amount}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="payment_method"
                      value={paymentFormData.payment_method}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2.5 rounded-lg text-white transition-colors ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Add Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeManagement;