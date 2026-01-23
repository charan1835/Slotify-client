import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://slotify-client.vercel.app';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState({});
    const [events, setEvents] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // Form states
    const [eventForm, setEventForm] = useState({
        name: '', categoryId: '', description: '', venue: '', address: '',
        city: '', date: '', startTime: '', endTime: '', capacity: '',
        ticketPrice: '', organizer: '', organizerContact: '', organizerEmail: '',
        image: '', status: 'upcoming', isFeatured: false, tags: ''
    });

    const [vendorForm, setVendorForm] = useState({
        name: '', categoryId: '', email: '', phone: '', price: '',
        maxPrice: '', rating: '', image: '', services: '',
        description: '', availability: true
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '', image: '', description: ''
    });

    useEffect(() => {
        fetchStats();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (activeTab === 'events') fetchEvents();
        if (activeTab === 'vendors') fetchVendors();
        if (activeTab === 'categories') fetchCategories();
        if (activeTab === 'bookings') fetchBookings();
    }, [activeTab]);

    // Fetch functions
    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/stats`);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/admin/events`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
        setLoading(false);
    };

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/admin/vendors`);
            setVendors(data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/admin/categories`);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        setLoading(false);
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/admin/bookings`);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
        setLoading(false);
    };

    // Modal handlers
    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);

        if (item) {
            if (type === 'event') {
                setEventForm({
                    ...item,
                    categoryId: item.categoryId?._id || item.categoryId,
                    date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
                    tags: item.tags?.join(', ') || ''
                });
            } else if (type === 'vendor') {
                setVendorForm({
                    ...item,
                    categoryId: item.categoryId?._id || item.categoryId,
                    services: item.services?.join(', ') || ''
                });
            } else if (type === 'category') {
                setCategoryForm(item);
            }
        } else {
            resetForms();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        resetForms();
    };

    const resetForms = () => {
        setEventForm({
            name: '', categoryId: '', description: '', venue: '', address: '',
            city: '', date: '', startTime: '', endTime: '', capacity: '',
            ticketPrice: '', organizer: '', organizerContact: '', organizerEmail: '',
            image: '', status: 'upcoming', isFeatured: false, tags: ''
        });
        setVendorForm({
            name: '', categoryId: '', email: '', phone: '', price: '',
            maxPrice: '', rating: '', image: '', services: '',
            description: '', availability: true
        });
        setCategoryForm({ name: '', image: '', description: '' });
    };

    // CRUD operations
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let endpoint = '';
            let payload = {};

            if (modalType === 'event') {
                endpoint = editingItem ? `${API_URL}/admin/events/${editingItem._id}` : `${API_URL}/admin/events`;
                payload = {
                    ...eventForm,
                    tags: eventForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                    capacity: eventForm.capacity ? Number(eventForm.capacity) : undefined,
                    ticketPrice: eventForm.ticketPrice ? Number(eventForm.ticketPrice) : undefined
                };
            } else if (modalType === 'vendor') {
                endpoint = editingItem ? `${API_URL}/admin/vendors/${editingItem._id}` : `${API_URL}/admin/vendors`;
                payload = {
                    ...vendorForm,
                    services: vendorForm.services.split(',').map(s => s.trim()).filter(Boolean),
                    price: vendorForm.price ? Number(vendorForm.price) : undefined,
                    maxPrice: vendorForm.maxPrice ? Number(vendorForm.maxPrice) : undefined,
                    rating: vendorForm.rating ? Number(vendorForm.rating) : undefined
                };
            } else if (modalType === 'category') {
                endpoint = editingItem ? `${API_URL}/admin/categories/${editingItem._id}` : `${API_URL}/admin/categories`;
                payload = categoryForm;
            }

            if (editingItem) {
                await axios.put(endpoint, payload);
            } else {
                await axios.post(endpoint, payload);
            }

            closeModal();
            if (modalType === 'event') fetchEvents();
            if (modalType === 'vendor') fetchVendors();
            if (modalType === 'category') fetchCategories();
            fetchStats();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving data. Please check console.');
        }
        setLoading(false);
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await axios.delete(`${API_URL}/admin/${type}s/${id}`);
            if (type === 'event') fetchEvents();
            if (type === 'vendor') fetchVendors();
            if (type === 'category') fetchCategories();
            if (type === 'booking') fetchBookings();
            fetchStats();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting item.');
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/admin/bookings/${id}`, { status });
            fetchBookings();
            fetchStats();
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Error updating booking status.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage events, vendors, and categories</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard title="Total Events" value={stats.totalEvents || 0} icon="🎉" color="blue" />
                    <StatCard title="Total Vendors" value={stats.totalVendors || 0} icon="🏢" color="purple" />
                    <StatCard title="Categories" value={stats.totalCategories || 0} icon="📁" color="green" />
                    <StatCard title="Upcoming" value={stats.upcomingEvents || 0} icon="📅" color="orange" />
                    <StatCard title="Total Bookings" value={stats.totalBookings || 0} icon="📋" color="blue" />
                    <StatCard title="Pending" value={stats.pendingBookings || 0} icon="⏳" color="orange" />
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                    <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
                        {['stats', 'events', 'vendors', 'categories', 'bookings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-semibold capitalize transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'stats' && <StatsView stats={stats} />}
                        {activeTab === 'events' && (
                            <DataTable
                                title="Events"
                                data={events}
                                onAdd={() => openModal('event')}
                                onEdit={(item) => openModal('event', item)}
                                onDelete={(id) => handleDelete('event', id)}
                                loading={loading}
                                columns={['name', 'venue', 'date', 'status']}
                            />
                        )}
                        {activeTab === 'vendors' && (
                            <DataTable
                                title="Vendors"
                                data={vendors}
                                onAdd={() => openModal('vendor')}
                                onEdit={(item) => openModal('vendor', item)}
                                onDelete={(id) => handleDelete('vendor', id)}
                                loading={loading}
                                columns={['name', 'email', 'phone', 'price']}
                            />
                        )}
                        {activeTab === 'categories' && (
                            <DataTable
                                title="Categories"
                                data={categories}
                                onAdd={() => openModal('category')}
                                onEdit={(item) => openModal('category', item)}
                                onDelete={(id) => handleDelete('category', id)}
                                loading={loading}
                                columns={['name', 'description']}
                            />
                        )}
                        {activeTab === 'bookings' && (
                            <BookingsTable
                                bookings={bookings}
                                loading={loading}
                                onUpdateStatus={handleUpdateBookingStatus}
                                onDelete={(id) => handleDelete('booking', id)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal onClose={closeModal}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                        {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {modalType === 'event' && (
                            <EventForm form={eventForm} setForm={setEventForm} categories={categories} />
                        )}
                        {modalType === 'vendor' && (
                            <VendorForm form={vendorForm} setForm={setVendorForm} categories={categories} />
                        )}
                        {modalType === 'category' && (
                            <CategoryForm form={categoryForm} setForm={setCategoryForm} />
                        )}
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// Components
const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600'
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{icon}</span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white font-bold text-xl`}>
                    {value}
                </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">{title}</h3>
        </div>
    );
};

const StatsView = ({ stats }) => (
    <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">View your platform statistics above</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalEvents || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalVendors || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Vendors</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalCategories || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.upcomingEvents || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
            </div>
        </div>
    </div>
);

const DataTable = ({ title, data, onAdd, onEdit, onDelete, loading, columns }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <button
                onClick={onAdd}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
                <span className="text-xl">+</span> Add New
            </button>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        ) : data.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-900 rounded-xl">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-600 dark:text-gray-400">No {title.toLowerCase()} found</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-700">
                            {columns.map(col => (
                                <th key={col} className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 capitalize">
                                    {col}
                                </th>
                            ))}
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item._id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                {columns.map(col => (
                                    <td key={col} className="py-4 px-4 text-gray-800 dark:text-gray-200">
                                        {col === 'date' ? new Date(item[col]).toLocaleDateString() :
                                            typeof item[col] === 'object' && item[col]?.name ? item[col].name :
                                                item[col] || '-'}
                                    </td>
                                ))}
                                <td className="py-4 px-4 text-right">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(item._id)}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

const EventForm = ({ form, setForm, categories }) => (
    <div className="grid grid-cols-2 gap-4">
        <Input label="Event Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} options={categories} required />
        <Input label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required className="col-span-2" />
        <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <Input label="Ticket Price" type="number" value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} />
        <Input label="Organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
        <Input label="Organizer Contact" value={form.organizerContact} onChange={(e) => setForm({ ...form, organizerContact: e.target.value })} />
        <Input label="Organizer Email" type="email" value={form.organizerEmail} onChange={(e) => setForm({ ...form, organizerEmail: e.target.value })} className="col-span-2" />
        <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="col-span-2" />
        <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="col-span-2" />
        <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[
            { _id: 'upcoming', name: 'Upcoming' },
            { _id: 'ongoing', name: 'Ongoing' },
            { _id: 'completed', name: 'Completed' },
            { _id: 'cancelled', name: 'Cancelled' }
        ]} />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-2" />
    </div>
);

const VendorForm = ({ form, setForm, categories }) => (
    <div className="grid grid-cols-2 gap-4">
        <Input label="Vendor Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} options={categories} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Min Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <Input label="Max Price" type="number" value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: e.target.value })} />
        <Input label="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <Input label="Services (comma separated)" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} className="col-span-2" />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-2" />
    </div>
);

const CategoryForm = ({ form, setForm }) => (
    <div className="space-y-4">
        <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
    </div>
);

const Input = ({ label, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <input
            {...props}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
    </div>
);

const Select = ({ label, options, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <select
            {...props}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        >
            <option value="">Select {label}</option>
            {options.map(opt => (
                <option key={opt._id} value={opt._id}>{opt.name}</option>
            ))}
        </select>
    </div>
);

const Textarea = ({ label, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <textarea
            {...props}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
    </div>
);

const BookingsTable = ({ bookings, loading, onUpdateStatus, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bookings</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {bookings.length} bookings
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-600 dark:text-gray-400">No bookings found</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-slate-700">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">User</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Vendor</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Event Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="text-gray-800 dark:text-gray-200 font-medium">{booking.userName}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{booking.userEmail}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-gray-800 dark:text-gray-200">{booking.vendorId?.name || 'N/A'}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{booking.vendorId?.email || ''}</div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200">
                                        {new Date(booking.eventDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200">
                                        {booking.userPhone || 'N/A'}
                                    </td>
                                    <td className="py-4 px-4">
                                        <select
                                            value={booking.status}
                                            onChange={(e) => onUpdateStatus(booking._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)} border-none outline-none cursor-pointer`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => onDelete(booking._id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
