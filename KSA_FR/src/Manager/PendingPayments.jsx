import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import { Search, Download, ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";

const PendingPayments = () => {
  const ip = import.meta.env.VITE_IP;
  const [trainees, setTrainees] = useState([]);
  const [sports, setSports] = useState([]);
  const [batches, setBatches] = useState([]);
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userid")}`,
    },
  });

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
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
    fetchSports();
    fetchBatches();
    fetchPlans();
  }, []);

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
      console.error("Error fetching trainees:", error);
      setError("Failed to fetch trainees. Please try again.");
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
      setError("Failed to fetch sports.");
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
      setError("Failed to fetch batches.");
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await axiosInstance.post(`${ip}/api/academy/active-plans`);
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to fetch plans.");
    }
  };

  const getSportName = (sportId) => {
    const sport = sports.find((s) => s._id === sportId);
    return sport ? sport.name : sportId || "N/A";
  };

  const getBatchName = (batchId) => {
    const batch = batches.find((b) => b._id === batchId);
    return batch
      ? `${batch.name} (${formatTime(batch.start_time)} - ${formatTime(batch.end_time)})`
      : batchId || "N/A";
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredTrainees = useMemo(() => {
    let result = trainees.filter(
      (trainee) =>
        trainee.payment_status === "PARTIAL" &&
        Number(trainee.pending_amount) > 0
    );

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (trainee) =>
          trainee.name.toLowerCase().includes(searchLower) ||
          trainee.roll_no.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "total_amount" || sortConfig.key === "pending_amount") {
        aValue = Number(a[sortConfig.key] || 0);
        bValue = Number(b[sortConfig.key] || 0);
      } else if (sortConfig.key === "due_date") {
        aValue = new Date(a.expiry_date || "9999-12-31");
        bValue = new Date(b.expiry_date || "9999-12-31");
      } else {
        aValue = aValue ? aValue.toLowerCase() : "";
        bValue = bValue ? bValue.toLowerCase() : "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [trainees, searchQuery, sortConfig]);

  const paginatedTrainees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTrainees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTrainees, currentPage]);

  const totalPages = Math.ceil(filteredTrainees.length / itemsPerPage);

  const handleDownloadPendingPaymentsPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const colors = {
        primary: "#1E3A8A", // Navy blue
        secondary: "#FEF3C7", // Light amber
        text: "#111827", // Dark gray
        muted: "#6B7280", // Gray
        accent: "#F59E0B", // Amber
        border: "#D1D5DB", // Light gray
      };

      // Header
      doc.setFillColor(colors.primary);
      doc.rect(0, 0, 595.28, 100, "F");
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Pending Payments Report", 297.5, 60, { align: "center" });

      // Logo
      const logoUrl = "/logo.jpg";
      try {
        const logoImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = logoUrl;
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load logo"));
        });
        doc.addImage(logoImg, "JPEG", 40, 20, 80, 0);
      } catch (err) {
        console.warn("Failed to load logo:", err);
        doc.setFontSize(10);
        doc.setTextColor(colors.muted);
        doc.text("Logo not available", 40, 30);
      }

      // Academy Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text);
      doc.text("KAVYA SPORTS ACADEMY", 40, 120);
      doc.setFontSize(10);
      doc.setTextColor(colors.muted);
      doc.text("+91 94292 67077", 40, 135);
      doc.text(
        "FP-9, Opp. Diamond 27, Nr. Kadi Nagrik Bank, TP 69, New Chandkheda, Ahmedabad-382424",
        40,
        150,
        { maxWidth: 200 }
      );

      // Report Date
      const reportDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFontSize(10);
      doc.setTextColor(colors.muted);
      doc.text(`Date: ${reportDate}`, 572, 120, { align: "right" });

      // Table
      const tableTop = 180;
      doc.setFillColor(colors.primary);
      doc.rect(40, tableTop, 515, 30, "F");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("No.", 50, tableTop + 10);
      doc.text("Name", 80, tableTop + 10);
      doc.text("Roll No", 150, tableTop + 10);
      doc.text("Sport", 200, tableTop + 10);
      doc.text("Batch", 260, tableTop + 10);
      doc.text("Total", 360, tableTop + 10, { align: "right" });
      doc.text("Paid", 420, tableTop + 10, { align: "right" });
      doc.text("Pending", 480, tableTop + 10, { align: "right" });
      doc.text("Due Date", 535, tableTop + 10, { align: "right" });

      let currentY = tableTop + 30;
      filteredTrainees.forEach((trainee, index) => {
        const rowY = currentY + index * 30;
        doc.setFillColor(index % 2 === 0 ? colors.secondary : "#F9FAFB");
        doc.rect(40, rowY, 515, 30, "F");
        doc.setFontSize(9);
        doc.setTextColor(colors.text);

        const paidAmount = Number(trainee.amount) - Number(trainee.pending_amount);

        doc.text(`${index + 1}`, 50, rowY + 10);
        doc.text(trainee.name || "N/A", 80, rowY + 10, { maxWidth: 60 });
        doc.text(trainee.roll_no || "N/A", 150, rowY + 10, { maxWidth: 40 });
        doc.text(getSportName(trainee.sport_id), 200, rowY + 10, { maxWidth: 50 });
        doc.text(getBatchName(trainee.batch_id), 260, rowY + 10, { maxWidth: 90 });
        doc.text(
          `₹${Number(trainee.amount).toFixed(2)}`,
          360,
          rowY + 10,
          { align: "right" }
        );
        doc.text(
          `₹${paidAmount.toFixed(2)}`,
          420,
          rowY + 10,
          { align: "right" }
        );
        doc.text(
          `₹${Number(trainee.pending_amount).toFixed(2)}`,
          480,
          rowY + 10,
          { align: "right" }
        );
        doc.text(
          formatDate(trainee.expiry_date),
          535,
          rowY + 10,
          { align: "right" }
        );
      });

      // Totals
      const totalY = currentY + filteredTrainees.length * 30 + 20;
      const totalAmount = filteredTrainees.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );
      const totalPaid = filteredTrainees.reduce(
        (sum, t) => sum + (Number(t.amount || 0) - Number(t.pending_amount || 0)),
        0
      );
      const totalPending = filteredTrainees.reduce(
        (sum, t) => sum + Number(t.pending_amount || 0),
        0
      );

      doc.setFontSize(10);
      doc.setTextColor(colors.accent);
      doc.text("Total:", 320, totalY);
      doc.setTextColor(colors.text);
      doc.text(`₹${totalAmount.toFixed(2)}`, 360, totalY, { align: "right" });
      doc.text(`₹${totalPaid.toFixed(2)}`, 420, totalY, { align: "right" });
      doc.text(`₹${totalPending.toFixed(2)}`, 480, totalY, { align: "right" });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(colors.muted);
      doc.text(
        "This is a computer-generated report. No signature required.",
        297.5,
        780,
        { align: "center" }
      );

      doc.save("Pending_Payments_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pending Payments ({filteredTrainees.length})</h2>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full md:w-64"
              />
            </div>
            <button
              onClick={handleDownloadPendingPaymentsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-white uppercase bg-blue-900 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No.
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-1 w-4 h-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Roll No
                </th>
                <th scope="col" className="px-6 py-3">
                  Sport
                </th>
                <th scope="col" className="px-6 py-3">
                  Batch
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("total_amount")}>
                  <div className="flex items-center justify-end">
                    Total Amount
                    <ArrowUpDown className="ml-1 w-4 h-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Paid Amount
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("pending_amount")}>
                  <div className="flex items-center justify-end">
                    Pending Amount
                    <ArrowUpDown className="ml-1 w-4 h-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort("due_date")}>
                  <div className="flex items-center justify-end">
                    Due Date
                    <ArrowUpDown className="ml-1 w-4 h-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrainees.map((trainee, index) => {
                const paidAmount = Number(trainee.amount) - Number(trainee.pending_amount);
                return (
                  <tr
                    key={trainee._id}
                    className="bg-white border-b hover:bg-amber-50 transition-colors"
                  >
                    <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4">{trainee.name || "N/A"}</td>
                    <td className="px-6 py-4">{trainee.roll_no || "N/A"}</td>
                    <td className="px-6 py-4">{getSportName(trainee.sport_id)}</td>
                    <td className="px-6 py-4">{getBatchName(trainee.batch_id)}</td>
                    <td className="px-6 py-4 text-right">₹{Number(trainee.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">₹{paidAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-amber-600">
                      ₹{Number(trainee.pending_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">{formatDate(trainee.expiry_date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTrainees.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No pending payments found.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayments;