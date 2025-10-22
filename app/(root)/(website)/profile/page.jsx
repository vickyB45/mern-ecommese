'use client'

import React, { useState, useEffect } from 'react';
import UserPanelLayout from '@/components/Aplication/website/UserPanelLayout';
import WebsiteBreadcrumb from '@/components/Aplication/website/WebsiteBreadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { showToast } from '@/lib/showToast';
import useFetch from '@/hooks/useFetch';
import axios from 'axios';

const breadCrumbData = {
  title: "Profile",
  links: [{ label: "Profile" }],
};

const ProfilePage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch profile data
  const { data: profileData, loading } = useFetch({ url: "/api/profile/get" });

  // Sync fetched data to local state
  useEffect(() => {
    if (profileData?.data) {
      setProfile(profileData.data);
      setImagePreview(profileData.data.avatar?.url || null);
    }
  }, [profileData]);

  // Validation schema
  const ProfileSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('name', values.fullName);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const { data: response } = await axios.put('/api/profile/update', formData);

      if (!response.success) {
        throw new Error(response.message || 'Update failed');
      }

      showToast({ message: 'Profile updated successfully!', type: "success" });

      // Update local profile state immediately
      setProfile((prev) => ({
        ...prev,
        name: values.fullName,
        phone: values.phone,
        address: values.address,
        avatar: response.data.avatar || prev.avatar,
      }));

      // Reset imageFile only (keep preview)
      setImageFile(null);

    } catch (error) {
      showToast({ message: error.message || 'Something went wrong!', type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !profile) {
    return (
      <UserPanelLayout>
        <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
          Loading profile...
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg md:p-6 p-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <label htmlFor="image-upload" className="cursor-pointer">
                <img
                  src={imagePreview || '/assets/images/img-placeholder.webp'}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md hover:opacity-80 transition"
                />
                <div className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg">
                  ✎
                </div>
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setImagePreview(URL.createObjectURL(file));
                  setImageFile(file);
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Form */}
          <Formik
            enableReinitialize
            initialValues={{
              fullName: profile.name || '',
              address: profile.address || '',
              phone: profile.phone || '',
              image: null,
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                  <Field
                    name="fullName"
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
                  <Field
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                  <Field
                    name="address"
                    placeholder="Enter your address"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Submit */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-primary text-white px-6 py-3 rounded-lg font-semibold transition ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default ProfilePage;
