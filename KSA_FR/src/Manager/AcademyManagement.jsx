import React, { useState, useEffect } from "react";
import axios from "axios";
import TraineeManagement from "./TraineeManagement";
import {
  Plus,
  Edit,
  Users,
  ClipboardList,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

const AcademyManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [plans, setPlans] = useState([]);
  const [sports, setSports] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [showPlanPopup, setShowPlanPopup] = useState(false); // Separate popup for Plans
  const [showSportPopup, setShowSportPopup] = useState(false); // Separate popup for Sports
  const [showInstitutePopup, setShowInstitutePopup] = useState(false); // Separate popup for Institutes
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingSport, setEditingSport] = useState(null);
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [showSports, setShowSports] = useState(false);
  const [showInstitutes, setShowInstitutes] = useState(false);
  const [showTrainee, setShowTrainee] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    plan_limit: "",
    sport: "",
    active: true,
  });
  const [sportFormData, setSportFormData] = useState({ name: "", active: true });
  const [instituteFormData, setInstituteFormData] = useState({ name: "", active: true });

  const toggleSection = (section) => {
    if (section === "plans") setShowPlans(!showPlans);
    else if (section === "sports") setShowSports(!showSports);
    else if (section === "institutes") setShowInstitutes(!showInstitutes);
    else if (section === "trainee") setShowTrainee(!showTrainee);
  };

  useEffect(() => {
    fetchPlans();
    fetchSports();
    fetchInstitutes();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.post(`${ip}/api/academy/all-plans`, {
        userId: localStorage.getItem("userid"),
      });
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
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

  const handleInputChange = (e, type) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (type === "plan") {
      setFormData({ ...formData, [e.target.name]: value });
    } else if (type === "sport") {
      setSportFormData({ ...sportFormData, [e.target.name]: value });
    } else if (type === "institute") {
      setInstituteFormData({ ...instituteFormData, [e.target.name]: value });
    }
  };

  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await axios.put(`${ip}/api/academy/update-plan/${editingPlan._id}`, formData);
      } else {
        await axios.post(`${ip}/api/academy/add-plan`, {
          ...formData,
          userId: localStorage.getItem("userid"),
        });
      }
      setFormData({ name: "", amount: "", plan_limit: "", sport: "", active: true });
      setEditingPlan(null);
      fetchPlans();
      setShowPlanPopup(false);
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleSubmitSport = async (e) => {
    e.preventDefault();
    try {
      if (editingSport) {
        await axios.put(`${ip}/api/academy/update-sport/${editingSport._id}`, sportFormData);
      } else {
        await axios.post(`${ip}/api/academy/add-sport`, {
          ...sportFormData,
          userId: localStorage.getItem("userid"),
        });
      }
      setSportFormData({ name: "", active: true });
      setEditingSport(null);
      fetchSports();
      setShowSportPopup(false);
    } catch (error) {
      console.error("Error saving sport:", error);
    }
  };

  const handleSubmitInstitute = async (e) => {
    e.preventDefault();
    try {
      if (editingInstitute) {
        await axios.put(`${ip}/api/academy/update-institute/${editingInstitute._id}`, instituteFormData);
      } else {
        await axios.post(`${ip}/api/academy/add-institute`, {
          ...instituteFormData,
          userId: localStorage.getItem("userid"),
        });
      }
      setInstituteFormData({ name: "", active: true });

      setEditingInstitute(null);
      fetchInstitutes();
      setShowInstitutePopup(false);
    } catch (error) {
      console.error("Error saving institute:", error);
    }
  };

  const toggleActive = async (id, type) => {
    try {
      if (type === "plan") {
        await axios.patch(`${ip}/api/academy/update-plan-status/${id}/toggle`);
        fetchPlans();
      } else if (type === "sport") {
        await axios.patch(`${ip}/api/academy/update-sport-status/${id}/toggle`);
        fetchSports();
      } else if (type === "institute") {
        await axios.patch(`${ip}/api/academy/update-institute-status/${id}/toggle`);
        fetchInstitutes();
      }
    } catch (error) {
      console.error(`Error toggling ${type} status:`, error);
    }
  };

  const deleteInstitute = async (instituteId) => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      try {
        const response = await fetch(`/api/academy/institutes/${instituteId}/delete`, {
          method: 'DELETE',
        });
        
        if (!response.status === 200) {
          throw new Error('Failed to delete institute');
        }
        
        // Update your local state to remove the deleted institute
        // Assuming you have a state with institutes array
        setInstitutes(prevInstitutes => 
          prevInstitutes.filter(institute => institute._id !== instituteId)
        );
      } catch (error) {
        console.error('Error deleting institute:', error);
        alert('Failed to delete institute');
      }
    }
  };

  const openEditPlanPopup = (plan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowPlanPopup(true);
  };

  const openEditSportPopup = (sport) => {
    setEditingSport(sport);
    setSportFormData(sport);
    setShowSportPopup(true);
  };

  const openEditInstitutePopup = (institute) => {
    setEditingInstitute(institute);
    setInstituteFormData(institute);
    setShowInstitutePopup(true);
  };

  const openAddPlanPopup = () => {
    setEditingPlan(null);
    setFormData({ name: "", amount: "", plan_limit: "", active: true });
    setShowPlanPopup(true);
  };

  const openAddSportPopup = () => {
    setEditingSport(null);
    setSportFormData({ name: "", active: true });
    setShowSportPopup(true);
  };

  const openAddInstitutePopup = () => {
    setEditingInstitute(null);
    setInstituteFormData({ name: "", active: true });
    setShowInstitutePopup(true);
  };

  return (
    <div className="min-h-screen p-0 md:p-4">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => toggleSection("plans")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
              showPlans ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-400"
            }`}
          >
            <ClipboardList className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
            {showPlans ? "Hide Plans" : "Show Plans"}
          </button>
          <button
            onClick={() => toggleSection("sports")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
              showSports ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-400"
            }`}
          >
            <ClipboardList className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
            {showSports ? "Hide Sports" : "Show Sports"}
          </button>
          <button
            onClick={() => toggleSection("institutes")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
              showInstitutes ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-400"
            }`}
          >
            <ClipboardList className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
            {showInstitutes ? "Hide Institutes" : "Show Institutes"}
          </button>
          <button
            onClick={() => toggleSection("trainee")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
              showTrainee ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-400"
            }`}
          >
            <Users className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
            {showTrainee ? "Hide Trainees" : "Show Trainees"}
          </button>
        </div>

        {/* Plans Section */}
        {showPlans && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={openAddPlanPopup}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                Add New Plan
              </button>
              <button
                onClick={openAddSportPopup}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                Add New Sport
              </button>
              <button
                onClick={openAddInstitutePopup}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                Add New Institute
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        plan.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4 sm:mb-6">
                    {/* <p className="text-sm sm:text-base text-gray-600">
                      <span className="font-medium">Sport:</span> {plan.sport}
                    </p> */}
                    <p className="text-sm sm:text-base text-gray-600">
                      <span className="font-medium">Duration:</span> {plan.plan_limit} days
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">₹{plan.amount}</p>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => toggleActive(plan._id, "plan")}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base ${
                        plan.active
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      } transition-colors`}
                    >
                      {plan.active ? (
                        <XCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      ) : (
                        <CheckCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      )}
                      {plan.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEditPlanPopup(plan)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm sm:text-base"
                    >
                      <Edit className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sports Section */}
        {showSports && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-semibold">Sports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {sports.map((sport) => (
                <div
                  key={sport._id}
                  className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{sport.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        sport.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sport.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => toggleActive(sport._id, "sport")}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base ${
                        sport.active
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      } transition-colors`}
                    >
                      {sport.active ? (
                        <XCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      ) : (
                        <CheckCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      )}
                      {sport.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEditSportPopup(sport)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm sm:text-base"
                    >
                      <Edit className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institutes Section */}
        {showInstitutes && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-semibold">Institutes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {institutes.map((institute) => (
                <div
                  key={institute._id}
                  className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{institute.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        institute.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {institute.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => toggleActive(institute._id, "institute")}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base ${
                        institute.active
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      } transition-colors`}
                    >
                      {institute.active ? (
                        <XCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      ) : (
                        <CheckCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      )}
                      {institute.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEditInstitutePopup(institute)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm sm:text-base"
                    >
                      <Edit className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      Edit
                    </button>
                    {/* <button
                      onClick={() => deleteInstitute(institute._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm sm:text-base"
                    >
                      <Trash2 className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                      Remove
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Plan Modal */}
        {showPlanPopup && (
          <div className="fixed z-50 inset-0 bg-black bg-opacity-10 flex items-center justify-center p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-2 p-3 sm:p-4 md:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                {editingPlan ? "Edit Plan" : "Add New Plan"}
              </h2>
              <form onSubmit={handleSubmitPlan} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, "plan")}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange(e, "plan")}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    name="plan_limit"
                    value={formData.plan_limit}
                    onChange={(e) => handleInputChange(e, "plan")}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={(e) => handleInputChange(e, "plan")}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Sport</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                  </select>
                </div> */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleInputChange(e, "plan")}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">
                    Active Plan
                  </label>
                </div>
                <div className="flex gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPlanPopup(false)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    {editingPlan ? "Update Plan" : "Add Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Sport Modal */}
        {showSportPopup && (
          <div className="fixed z-50 inset-0 bg-black bg-opacity-10 flex items-center justify-center p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-2 p-3 sm:p-4 md:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                {editingSport ? "Edit Sport" : "Add New Sport"}
              </h2>
              <form onSubmit={handleSubmitSport} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sport Name</label>
                  <input
                    type="text"
                    name="name"
                    value={sportFormData.name}
                    onChange={(e) => handleInputChange(e, "sport")}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    id="activeSport"
                    checked={sportFormData.active}
                    onChange={(e) => handleInputChange(e, "sport")}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="activeSport" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSportPopup(false)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    {editingSport ? "Update Sport" : "Add Sport"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Institute Modal */}
        {showInstitutePopup && (
          <div className="fixed z-50 inset-0 bg-black bg-opacity-10 flex items-center justify-center p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-2 p-3 sm:p-4 md:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                {editingInstitute ? "Edit Institute" : "Add New Institute"}
              </h2>
              <form onSubmit={handleSubmitInstitute} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                  <input
                    type="text"
                    name="name"
                    value={instituteFormData.name}
                    onChange={(e) => handleInputChange(e, "institute")}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    id="activeInstitute"
                    checked={instituteFormData.active}
                    onChange={(e) => handleInputChange(e, "institute")}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="activeInstitute" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInstitutePopup(false)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    {editingInstitute ? "Update Institute" : "Add Institute"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Trainee Section */}
        {showTrainee && <TraineeManagement />}
      </div>
    </div>
  )
};

export default AcademyManagement;