'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  file: FileList;
};

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('contact', data.contact);
    formData.append('email_id', data.email_id);
    if (data.file.length > 0) {
      formData.append('file', data.file[0]);
    }

    try {
      const res = await fetch('/api/schools/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert('School added successfully!');
        reset();
      } else {
        alert('Error: ' + result.error);
      }
    } catch{
      alert('Error submitting form');
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl mb-4 font-bold">Add a School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="School Name"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <textarea
          {...register('address', { required: 'Address is required' })}
          placeholder="Address"
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
        {errors.address && <p className="text-red-600">{errors.address.message}</p>}

        <input
          {...register('city', { required: 'City is required' })}
          placeholder="City"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.city && <p className="text-red-600">{errors.city.message}</p>}

        <input
          {...register('state', { required: 'State is required' })}
          placeholder="State"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.state && <p className="text-red-600">{errors.state.message}</p>}

        <input
          {...register('contact', {
            required: 'Contact is required',
            pattern: { value: /^[0-9]+$/, message: 'Contact must be numeric' },
          })}
          placeholder="Contact Number"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.contact && <p className="text-red-600">{errors.contact.message}</p>}

        <input
          {...register('email_id', {
            required: 'Email is required',
            pattern: {
              value:
                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: 'Invalid email address',
            },
          })}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}

        <input
          type="file"
          {...register('file', { required: 'Image is required' })}
          accept="image/*"
          className="w-full"
        />
        {errors.file && <p className="text-red-600">{errors.file.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Submitting...' : 'Add School'}
        </button>
      </form>
    </main>
  );
}
