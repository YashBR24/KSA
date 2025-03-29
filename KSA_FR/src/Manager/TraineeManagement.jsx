
import React, { useState, useEffect } from "react";
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
  CreditCard,
  BadgeCheck,
  Trash2,
  X,
  Filter,
  FileSpreadsheet,
} from "lucide-react";

const TraineeManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [trainees, setTrainees] = useState([]);
  const [plans, setPlans] = useState([]);
  const [sports, setSports] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [showTraineePopup, setShowTraineePopup] = useState(false);
  const [showRenewalPopup, setShowRenewalPopup] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [error, setError] = useState("");
  const [renewalFormData, setRenewalFormData] = useState({
    trainee_id: "",
    name: "",
    roll_no: "",
    plan_id: "",
    amount: 0,
    payment_method: "",
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
    active: true,
    photo: null,
    fatherSignature: null,
    occupation: "",
    current_class: "",
    name_of_school: "",
    traineeSignature: null,
    dateAndPlace: "",
    amount: 0,
    payment_method: "",
    start_date: moment().format("YYYY-MM-DD"),
    expiry_date: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  // Create axios instance with default headers
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userid")}`,
    },
  });

  const exportToExcel = () => {
    if (trainees.length === 0) {
      alert("No trainee data available for export.");
      return;
    }
    const excelData = trainees.map((trainee) => ({
      Name: trainee.name,
      "Father's Name": trainee.father,
      Phone: trainee.phone,
      DOB: moment(trainee.dob).format("DD-MM-YYYY"),
      Address: trainee.address,
      Plan: trainee.plan_id,
      "Start Date": moment(trainee.start_date).format("DD-MM-YYYY"),
      "Expiry Date": moment(trainee.expiry_date).format("DD-MM-YYYY"),
      "Amount Paid": `₹${trainee.amount}`,
      Active: trainee.active ? "Yes" : "No",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainees");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `Trainee_Data_${moment().format("YYYYMMDD")}.xlsx`);
  };

  const handleViewTrainee = (trainee) => {
    setSelectedTrainee(trainee);
  };

  const handleClosePopup = () => {
    setSelectedTrainee(null);
  };

  const filteredTrainees = trainees.filter((trainee) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      trainee.name.toLowerCase().includes(searchLower) ||
      trainee.roll_no.toLowerCase().includes(searchLower);
    const today = moment();
    const isExpired = moment(trainee.to).isBefore(today, "day");
    const isActive = !isExpired;
    const matchesMembershipFilter =
      membershipFilter === "all" ||
      (membershipFilter === "expired" && isExpired) ||
      (membershipFilter === "active" && isActive);
    return matchesSearch && matchesMembershipFilter;
  });

  useEffect(() => {
    fetchTrainees();
    fetchPlans();
    fetchSports();
    fetchInstitutes();
  }, []);

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(`${ip}/api/academy/trainees`);
      if (response.data.length === 0) {
        console.log("No trainees found.");
      }
      setTrainees(response.data);
    } catch (error) {
      console.error("Error fetching trainees:", error);
      setError("Failed to fetch trainees. Please try again.");
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await axiosInstance.post(`${ip}/api/academy/active-plans`);
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
    }
  };

  // Functions to get sport and institute names
  const getSportName = (sportId) => {
    const sport = sports.find((s) => s._id === sportId);
    return sport ? sport.name : sportId || "N/A";
  };

  const getInstituteName = (instituteId) => {
    const institute = institutes.find((i) => i._id === instituteId);
    return institute ? institute.name : instituteId || "N/A";
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
    const selectedPlan = plans.find((plan) => plan._id === planId);
    if (selectedPlan && selectedPlan.plan_limit && startDate) {
      const expiryDate = moment(startDate).add(selectedPlan.plan_limit, "days");
      return expiryDate.format("YYYY-MM-DD");
    }
    return "";
  };

  const handleTraineeInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "plan_id") {
      const selectedPlan = plans.find((plan) => plan._id === value);
      const expiryDate = calculateTraineeExpiryDate(value, traineeFormData.start_date);
      setTraineeFormData({
        ...traineeFormData,
        [name]: value,
        amount: selectedPlan ? selectedPlan.amount : 0,
        expiry_date: expiryDate,
      });
    } else if (name === "start_date") {
      const expiryDate = calculateTraineeExpiryDate(traineeFormData.plan_id, value);
      setTraineeFormData({
        ...traineeFormData,
        start_date: value,
        expiry_date: expiryDate,
      });
    } else {
      setTraineeFormData({ ...traineeFormData, [name]: value });
    }
  };

  const handleRenewalInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "plan_id") {
      const selectedPlan = plans.find((plan) => plan._id === value);
      const expiryDate = calculateTraineeExpiryDate(value, renewalFormData.start_date);
      setRenewalFormData({
        ...renewalFormData,
        [name]: value,
        amount: selectedPlan ? selectedPlan.amount : 0,
        expiry_date: expiryDate,
      });
    } else if (name === "start_date") {
      const expiryDate = calculateTraineeExpiryDate(renewalFormData.plan_id, value);
      setRenewalFormData({
        ...renewalFormData,
        start_date: value,
        expiry_date: expiryDate,
      });
    } else {
      setRenewalFormData({ ...renewalFormData, [name]: value });
    }
  };

  const handleTraineeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(traineeFormData).forEach((key) => {
      formData.append(key, traineeFormData[key]);
    });

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

      if (editingTrainee) {
        await axios.put(`${ip}/api/manager/update-trainee/${editingTrainee._id}`, formData, config);
      } else {
        await axios.post(`${ip}/api/manager/add-new-trainee`, formData, config);
      }

      fetchTrainees();
      setShowTraineePopup(false);
      setEditingTrainee(null);
      setError("");
    } catch (error) {
      console.error("Error submitting trainee data:", error);
      setError(error.response?.data?.message || "Failed to submit trainee data. Please try again.");
    }
  };

  const handleRenewalSubmit = async (e) => {
    e.preventDefault();
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

      await axios.post(`${ip}/api/academy/renewal`, renewalFormData, config);
      fetchTrainees();
      setShowRenewalPopup(false);
      setError("");
    } catch (error) {
      console.error("Error submitting renewal data:", error);
      setError(error.response?.data?.message || "Failed to submit renewal data. Please try again.");
    }
  };

  const openTraineePopup = (trainee = null) => {
    setEditingTrainee(trainee);
    setTraineeFormData(
      trainee
        ? {
            ...trainee,
            dob: trainee.dob ? moment(trainee.dob).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
            start_date: trainee.from ? moment(trainee.from).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
            expiry_date: trainee.to ? moment(trainee.to).format("YYYY-MM-DD") : "",
            sport_id: trainee.sport_id || "",
            institute_id: trainee.institute_id || "",
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
            active: true,
            photo: null,
            fatherSignature: null,
            occupation: "",
            current_class: "",
            name_of_school: "",
            traineeSignature: null,
            dateAndPlace: "",
            amount: 0,
            payment_method: "",
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
      plan_id: trainee.plan_id,
      amount: trainee.amount,
      payment_method: "",
      start_date: startDate,
      expiry_date: expiryDate,
    });
    setShowRenewalPopup(true);
  };

  const handleCancel = () => {
    setShowTraineePopup(false);
    setShowRenewalPopup(false);
    setError("");
  };

  const formatDateTime1 = (dateTime) => moment(dateTime).format("DD-MM-YYYY");

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
      console.error("Error deleting Trainee:", error);
      setError(error.response?.data?.message || "Failed to delete trainee. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-0 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trainee Management ({filteredTrainees.length})</h2>
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
            Add Trainee
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
                  src={`${ip}/uploads/${trainee.photo}`}
                  alt={trainee.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onClick={() => handleViewTrainee(trainee)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{trainee.name}</h3>
                <p className="text-sm text-gray-600">
                  Roll No: <span className="font-medium">{trainee.roll_no}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Expires: <span className="font-medium">{formatDateTime1(trainee.to)}</span>
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
                <h2 className="text-2xl font-bold text-gray-900">Trainee Details</h2>
                <button
                  onClick={handleClosePopup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-2">Trainee Photo</span>
                  <img
                    src={`${ip}/uploads/${selectedTrainee.photo}`}
                    alt="Trainee"
                    className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-2">Trainee's Signature</span>
                  <img
                    src={`${ip}/uploads/${selectedTrainee.signature}`}
                    alt="Trainee Signature"
                    className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-2">Father's Signature</span>
                  <img
                    src={`${ip}/uploads/${selectedTrainee.father_signature}`}
                    alt="Father's Signature"
                    className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Name" value={selectedTrainee.name} />
                <DetailItem label="Roll No" value={selectedTrainee.roll_no} />
                <DetailItem label="Father's Name" value={selectedTrainee.father} />
                <DetailItem label="Phone" value={selectedTrainee.phone} />
                <DetailItem label="Start Date" value={formatDateTime1(selectedTrainee.from)} />
                <DetailItem label="Expiry Date" value={formatDateTime1(selectedTrainee.to)} />
                <DetailItem label="Amount" value={`₹${selectedTrainee.amount}`} />
                <DetailItem label="Father's Occupation" value={selectedTrainee.occupation} />
                <DetailItem label="Sport" value={getSportName(selectedTrainee.sport_id)} />
                <DetailItem label="Institute" value={getInstituteName(selectedTrainee.institute_id)} />
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
                  {editingTrainee ? "Edit Trainee" : "Add New Trainee"}
                </h3>
                <form onSubmit={handleTraineeSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trainee Name</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                        <input
                          type="text"
                          name="father"
                          value={traineeFormData.father}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={traineeFormData.phone}
                          onChange={handleTraineeInputChange}
                          pattern="^[0-9]{10}$"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={traineeFormData.dob}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Contact & Education</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          name="address"
                          value={traineeFormData.address}
                          onChange={handleTraineeInputChange}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                          type="text"
                          name="name_of_school"
                          value={traineeFormData.name_of_school}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Class</label>
                        <input
                          type="text"
                          name="current_class"
                          value={traineeFormData.current_class}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
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
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Documents</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trainee Photo <span className="text-sm text-gray-500">(Max 50KB)</span>
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
                          Trainee Signature <span className="text-sm text-gray-500">(Max 50KB)</span>
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "traineeSignature")}
                          accept="image/*"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Father's Signature <span className="text-sm text-gray-500">(Max 50KB)</span>
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "fatherSignature")}
                          accept="image/*"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Plan & Payment Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Selection</label>
                        <select
                          name="plan_id"
                          value={traineeFormData.plan_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select a plan</option>
                          {plans.map((plan) => (
                            <option key={plan._id} value={plan._id}>
                              {plan.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Sport</label>
                        <select
                          name="sport_id"
                          value={traineeFormData.sport_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select a sport</option>
                          {sports.map((sport) => (
                            <option key={sport._id} value={sport._id}>
                              {sport.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Institute</label>
                        <select
                          name="institute_id"
                          value={traineeFormData.institute_id}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select an institute</option>
                          {institutes.map((institute) => (
                            <option key={institute._id} value={institute._id}>
                              {institute.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                          name="payment_method"
                          value={traineeFormData.payment_method}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Payment Method</option>
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="CARD">Card</option>
                          <option value="CHEQUE">Cheque</option>
                          <option value="NET BANKING">Net Banking</option>
                          <option value="DEMAND DRAFT">Demand Draft</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                          type="number"
                          name="amount"
                          value={traineeFormData.amount}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="start_date"
                          value={traineeFormData.start_date}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="date"
                          name="expiry_date"
                          value={traineeFormData.expiry_date}
                          onChange={handleTraineeInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
                    >
                      {editingTrainee ? "Update Trainee" : "Add Trainee"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenewalPopup && (
        <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl h-auto max-h-[90%] overflow-y-auto mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">Renew Membership</h3>
            <form onSubmit={handleRenewalSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student Name</label>
                  <input
                    type="text"
                    value={renewalFormData.name}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <input
                    type="text"
                    value={renewalFormData.roll_no}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
                  <select
                    name="plan_id"
                    value={renewalFormData.plan_id}
                    onChange={handleRenewalInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={renewalFormData.amount}
                    onChange={handleRenewalInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    name="payment_method"
                    value={renewalFormData.payment_method}
                    onChange={handleRenewalInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="NET BANKING">Net Banking</option>
                    <option value="DEMAND DRAFT">Demand Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={renewalFormData.start_date}
                    onChange={handleRenewalInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={renewalFormData.expiry_date}
                    onChange={(e) =>
                      setRenewalFormData({
                        ...renewalFormData,
                        expiry_date: e.target.value,
                      })
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <span className="text-sm text-gray-600">{label}</span>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

export default TraineeManagement;