import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FileText,
  FileSpreadsheet,
  Plus,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Building2,
  Trash2,
} from "lucide-react";

const AccountsOverview = () => {
  const ip = import.meta.env.VITE_IP;
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    totalIn: 0,
    totalOut: 0,
    currentBalance: 0,
  });

  const ADMIN_IDS = import.meta.env.VITE_ADMIN_IDS?.split(',') || [];
  const userId = localStorage.getItem("userid");
  const isAdmin = ADMIN_IDS.includes(userId);
  
  const getDefaultFilters = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const todayDate = new Date(year, month, today.getDate());

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const result = {
      amtInOut: "",
      fromDate: formatDate(firstDay),
      toDate: formatDate(todayDate),
      description: "",
      method: "",
      institute: "",
    };
    console.log("Default filters:", result);
    return result;
  };

  const [filters, setFilters] = useState(getDefaultFilters());
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amt_in_out: "",
    amount: "",
    method: "",
    description: "",
    instituteId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const fetchInstitutes = async () => {
    try {
      const response = await axios.post(`${ip}/api/academy/all-institutes`, {
        userId: localStorage.getItem("userid"),
      });
      const fetchedInstitutes = response.data.filter(
        (institute) => institute.active === true
      );

      setInstitutes(fetchedInstitutes);

      if (fetchedInstitutes.length > 0) {
        setSelectedInstitute(fetchedInstitutes[0]._id);
        setFilters((prev) => ({
          ...prev,
          institute: fetchedInstitutes[0]._id,
        }));
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setError("Failed to fetch institutes");
    }
  };

  const fetchInstituteBalance = async (instituteId) => {
    if (!instituteId) return;
    try {
      const response = await axios.post(`${ip}/api/accounts/transaction/calculate-balance`, {
        userId: localStorage.getItem("userid"),
        instituteId,
        startDate: filters.fromDate,
        endDate: filters.toDate,
      });
      
      setTotals({
        totalIn: response.data.totalIn || 0,
        totalOut: response.data.totalOut || 0,
        currentBalance: response.data.currentBalance || 0,
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching institute balance:", error);
      setError("Failed to fetch institute balance");
      setTotals({ totalIn: 0, totalOut: 0, currentBalance: 0 });
    }
  };

  const fetchAccounts = async () => {
    if (!selectedInstitute) return;
    setLoading(true);
    const userid = localStorage.getItem("userid");
    try {
      const response = await axios.post(`${ip}/api/accounts/transactions`, {
        userId: userid,
        instituteId: selectedInstitute,
      });

      let transactions = [];
      if (Array.isArray(response.data)) {
        transactions = response.data;
      } else if (response.data && Array.isArray(response.data.transactions)) {
        transactions = response.data.transactions;
      } else {
        console.error("Unexpected response format:", response.data);
        transactions = [];
      }

      console.log("Fetched transactions:", transactions);
      setAccounts(transactions);
      setError(null);
      
      await fetchInstituteBalance(selectedInstitute);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to fetch account data");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const closeExpenseForm = () => {
    setNewExpense({
      amt_in_out: "",
      amount: "",
      method: "",
      description: "",
      instituteId: "",
    });
    setShowExpenseForm(false);
  };

  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem("userid");
      if (!userId) throw new Error("User ID not found");

      const response = await axios.post(`${ip}/api/accounts/transaction/add`, {
        userId,
        ...newExpense,
        amount: Number(newExpense.amount),
      });

      if (response.data) {
        await Promise.all([
          fetchAccounts(),
          fetchInstituteBalance(selectedInstitute),
        ]);
        closeExpenseForm();
        setError(null);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError(error.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      console.log("Updated filters:", newFilters);
      return newFilters;
    });

    if (name === "institute") {
      setSelectedInstitute(value);
    }
  };

  const applyFiltersAndCalculateBalances = (data) => {
    if (!Array.isArray(data)) {
      console.error("Input data is not an array:", data);
      return [];
    }
  
    if (data.length === 0) {
      console.log("No transactions to filter");
      return [];
    }

    const filtered = data.filter((account) => {
      if (!account) {
        console.log("Found null/undefined account in data");
        return false;
      }
      
      const matchesAmtInOut =
        !filters.amtInOut || account.amt_in_out === filters.amtInOut;
      const matchesMethod = !filters.method || account.method === filters.method;
      const matchesDescription =
        !filters.description ||
        (account.description &&
          account.description
            .toLowerCase()
            .includes(filters.description.toLowerCase()));
      const matchesInstitute =
        !filters.institute ||
        (account.institute
          ? typeof account.institute === 'object'
            ? account.institute._id.toString() === filters.institute
            : account.institute.toString() === filters.institute
          : false);
      
      // Normalize dates to compare only YYYY-MM-DD
      let matchesDateRange = true;
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        const createdAt = new Date(account.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        matchesDateRange = createdAt >= fromDate;
      }
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999); // Include entire toDate
        const createdAt = new Date(account.createdAt);
        matchesDateRange = matchesDateRange && createdAt <= toDate;
      }

      const passesFilter =
        matchesAmtInOut &&
        matchesMethod &&
        matchesDescription &&
        matchesInstitute &&
        matchesDateRange;

      console.log("Account:", account, "Passes filter:", passesFilter, {
        matchesAmtInOut,
        matchesMethod,
        matchesDescription,
        matchesInstitute,
        matchesDateRange,
      });

      return passesFilter;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Filtered transactions:", filtered);
    return filtered;
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem("userid");
      await axios.post(`${ip}/api/accounts/delete-transaction`, {
        userId,
        transactionId: transactionToDelete._id,
      });

      await Promise.all([
        fetchAccounts(),
        fetchInstituteBalance(selectedInstitute),
      ]);
      setError(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError(error.response?.data?.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setTransactionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setTransactionToDelete(null);
  };

  useEffect(() => {
    const filteredWithBalances = applyFiltersAndCalculateBalances(accounts);
    setFilteredData(filteredWithBalances);
    setCurrentPage(1);
  }, [accounts, filters]);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (selectedInstitute) {
      fetchAccounts();
    }
  }, [selectedInstitute]);

  useEffect(() => {
    if (selectedInstitute) {
      fetchInstituteBalance(selectedInstitute);
    }
  }, [filters.fromDate, filters.toDate, selectedInstitute]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Account Statement", 20, 10);
    autoTable(doc, {
      head: [
        [
          "#",
          "Date",
          "Type",
          "Amount",
          "Description",
          "Method",
        ],
      ],
      body: filteredData.map((account, index) => [
        index + 1,
        new Date(account.createdAt).toLocaleString(),
        account.amt_in_out,
        account.amount,
        account.description,
        account.method,
      ]),
    });
    doc.save("account-statement.pdf");
  };

  const handleDownloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((account, index) => ({
        "#": index + 1,
        Date: new Date(account.createdAt).toLocaleString(),
        "Amount In/Out": account.amt_in_out,
        Amount: account.amount,
        Description: account.description,
        Method: account.method,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "account-statement.xlsx");
  };

  return (
    <div className="min-h-screen bg-transparent p-0 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm sm:text-base"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Export PDF
            </button>
            <button
              onClick={handleDownloadXLSX}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base"
            >
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Export Excel
            </button>
          </div>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base sm:ml-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Select Institute</h3>
          </div>
          <select
            name="institute"
            value={filters.institute}
            onChange={handleFilterChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {institutes.length === 0 ? (
              <option value="">No active institutes available</option>
            ) : (
              institutes.map((institute) => (
                <option key={institute._id} value={institute._id}>
                  {institute.name}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedInstitute && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Current Balance
                  </h3>
                  <Wallet className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ₹{totals.currentBalance.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total In</h3>
                  <ArrowUpCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₹{totals.totalIn.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total Out</h3>
                  <ArrowDownCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  ₹{totals.totalOut.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Filters
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                <div> 
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="amtInOut"
                    value={filters.amtInOut}
                    onChange={handleFilterChange}
                    className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
                  >
                    <option value="">All</option>
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Method
                  </label>
                  <select
                    name="method"
                    value={filters.method}
                    onChange={handleFilterChange}
                    className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
                  >
                    <option value="">All</option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">Online</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-3 lg:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={filters.description}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                    className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <span className="text-gray-600 text-sm">
                  Showing {itemsPerPage} records per page
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[10, 25, 50, 100].map((limit) => (
                    <option key={limit} value={limit}>
                      {limit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      {isAdmin && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isAdmin ? 7 : 6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No transactions found for the selected institute and
                          filters
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((account, index) => (
                        <tr key={account._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(account.createdAt)
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })
                              .replace("am", "AM")
                              .replace("pm", "PM")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                account.amt_in_out === "IN"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {account.amt_in_out}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{Number(account.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {account.description || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {account.method === "UPI" ? "ONLINE" : account.method || "N/A"}
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => handleDeleteClick(account)}
                                className="text-red-600 hover:text-red-800"
                                disabled={loading}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center p-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Transaction</h2>
                <button
                  onClick={closeExpenseForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="amt_in_out"
                    value={newExpense.amt_in_out}
                    onChange={handleExpenseChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Method
                  </label>
                  <select
                    name="method"
                    value={newExpense.method}
                    onChange={handleExpenseChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Method</option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">Online</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute
                  </label>
                  <select
                    name="instituteId"
                    value={newExpense.instituteId}
                    onChange={handleExpenseChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleExpenseChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={newExpense.description}
                    onChange={handleExpenseChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleAddExpense}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Transaction"}
                  </button>
                  <button
                    type="button"
                    onClick={closeExpenseForm}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this transaction:{" "}
                "{transactionToDelete?.description}" for ₹
                {transactionToDelete?.amount.toFixed(2)}?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && !showDeleteConfirm && (
          <div className="fixed inset-0 bg-white bg-opacity-0 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4">
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="fixed bottom-4 right-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsOverview;