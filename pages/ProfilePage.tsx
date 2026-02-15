
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { Student, ProfessionalUser } from '../types';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useContext(AuthContext);
    const dataContext = useContext(DataContext);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitialFormData = () => {
        const studentUser = user?.role === 'student' ? user as Student : null;
        return {
            name: user?.name || '',
            email: user?.email || '',
            phone: studentUser?.phone || '',
            fatherPhone: studentUser?.fatherPhone || '',
            motherPhone: studentUser?.motherPhone || '',
            emergencyPhone: studentUser?.emergencyPhone || '',
            address: studentUser?.address || '',
            permanentAddress: studentUser?.permanentAddress || '',
            profilePicUrl: user?.profilePicUrl || '',
        }
    };
    
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (user) {
            setFormData(getInitialFormData());
        }
    }, [user]);

    if (!user) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = () => {
        if (user && updateUser) {
            updateUser(formData);
            if (user.role === 'student' && dataContext?.updateStudentDetails) {
                dataContext.updateStudentDetails(user.id, formData);
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(getInitialFormData());
        setIsEditing(false);
    };

    const professionalUser = user.role !== 'student' ? user as ProfessionalUser : null;
    const studentUser = user.role === 'student' ? user as Student : null;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Manage Profile</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="flex-shrink-0 text-center">
                        <img className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-300" src={formData.profilePicUrl} alt={user.name} />
                        {isEditing && (
                            <>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="mt-4 text-sm text-primary-600 hover:underline">Change Photo</button>
                            </>
                        )}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        {isEditing ? (
                             <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500" />
                        ) : (
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        )}
                        <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold">{professionalUser?.designation || `${studentUser?.department} - Sem ${studentUser?.semester}`}</p>
                        <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{user.id}</p>
                    </div>
                    <div className="flex-shrink-0">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Edit Profile</button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Cancel</button>
                                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:shadow-md hover:[transform:perspective(800px)_translateZ(5px)_rotateX(5deg)]">Save</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        {/* Static Details */}
                        <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">USN</dt><dd className="mt-1 text-lg text-gray-900 dark:text-white">{user.id}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt><dd className="mt-1 text-lg text-gray-900 dark:text-white">{user.department}</dd></div>
                        {studentUser && <>
                            <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">CGPA</dt><dd className="mt-1 text-lg text-gray-900 dark:text-white">{studentUser.cgpa}</dd></div>
                            <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Batch Year</dt><dd className="mt-1 text-lg text-gray-900 dark:text-white">{studentUser.batchYear}</dd></div>
                        </>}

                        {/* Editable Details */}
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</dt>
                            {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.email}</dd>}
                        </div>
                        {studentUser && <>
                            <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>{isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.phone}</dd>}</div>
                            <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Father Phone</dt>{isEditing ? <input type="tel" name="fatherPhone" value={formData.fatherPhone} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.fatherPhone}</dd>}</div>
                            <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mother Phone</dt>{isEditing ? <input type="tel" name="motherPhone" value={formData.motherPhone} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.motherPhone}</dd>}</div>
                            <div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Phone</dt>{isEditing ? <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.emergencyPhone}</dd>}</div>
                            <div className="sm:col-span-2"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>{isEditing ? <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.address}</dd>}</div>
                            <div className="sm:col-span-2"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Permanent Address</dt>{isEditing ? <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /> : <dd className="mt-1 text-lg text-gray-900 dark:text-white">{formData.permanentAddress}</dd>}</div>
                        </>}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
