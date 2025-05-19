import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';

const ip = import.meta.env.VITE_IP;

const InventoryTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [selectedInstitute, setSelectedInstitute] = useState('');
    const [selectedInventory, setSelectedInventory] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const userid = localStorage.getItem('userid');

    useEffect(() => {
        fetchInstitutes();
    }, []);

    useEffect(() => {
        if (selectedInstitute) {
            fetchInventoryItems();
            fetchTransactions();
        }
    }, [selectedInstitute, selectedInventory]);

    const fetchInstitutes = async () => {
        try {
            const response = await axios.post(`${ip}/api/academy/all-institutes`, {
                userId: userid
            });
            const fetchedInstitutes = response.data.filter(institute => institute.active === true);
            setInstitutes(fetchedInstitutes);
            if (fetchedInstitutes.length > 0) {
                setSelectedInstitute(fetchedInstitutes[0]._id);
            }
        } catch (error) {
            console.error('Error fetching institutes:', error);
        }
    };

    const fetchInventoryItems = async () => {
        if (!selectedInstitute) return;
        try {
            const response = await axios.post(`${ip}/api/inventory/get-all-inventory`, {
                userid: userid,
                instituteId: selectedInstitute
            });
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const fetchTransactions = async () => {
        if (!selectedInstitute) return;
        setLoading(true);
        try {
            const response = await axios.post(`${ip}/api/inventory/fetch-inventory-transactions`, {
                userid: userid,
                instituteId: selectedInstitute,
                invid: selectedInventory || undefined
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
        setLoading(false);
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.inv_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Transactions</h1>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div>
                            <select
                                value={selectedInstitute}
                                onChange={(e) => {
                                    setSelectedInstitute(e.target.value);
                                    setSelectedInventory('');
                                }}
                                className="w-full max-w-xs rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition-all duration-300 ease-in-out hover:border-indigo-300 hover:shadow-xl text-base font-medium"
                                disabled={institutes.length === 0}
                            >
                                {institutes.length === 0 ? (
                                    <option value="">Loading institutes...</option>
                                ) : (
                                    institutes.map((institute) => (
                                        <option key={institute._id} value={institute._id}>
                                            {institute.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedInventory}
                                onChange={(e) => setSelectedInventory(e.target.value)}
                                className="w-full max-w-xs rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition-all duration-300 ease-in-out hover:border-indigo-300 hover:shadow-xl text-base font-medium"
                                disabled={!selectedInstitute || inventoryItems.length === 0}
                            >
                                <option value="">All Inventory Items</option>
                                {inventoryItems.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center bg-white rounded-lg shadow-sm p-2 border-gray-400">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : !selectedInstitute ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            Please select an institute to view transactions
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((transaction) => (
                                        <tr key={transaction._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {transaction.inv_id?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {transaction.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {transaction.qty}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                ₹{transaction.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {transaction.payment_method || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {transaction.description}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryTransactions;