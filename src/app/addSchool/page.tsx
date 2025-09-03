"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("contact", data.contact);
    formData.append("email_id", data.email_id);
    if (data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    try {
      const res = await fetch("/api/schools/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert("School added successfully!");
        reset();
        router.push("/showSchools");
      } else {
        alert("Error: " + result.error);
      }
    } catch {
      alert("Error submitting form");
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4">
      <div className="flex justify-start gap-4 items-center">
        <h1 className="text-2xl mb-4 font-bold">Add a School</h1>
        <div className="mb-6 gap-2 flex border p-2 text-center rounded-md">
          <p className="items-center flex">Show all schools</p>
          <button
            className="flex items-center bg-blue-300 rounded-full p-2"
            onClick={() => router.push("/showSchools")}
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#ffffff"
                d="M18.155 13.199l2.88-1.703-.928-.547.983-.582L23 11.495l-3.564 2.108a8.664 8.664 0 0 0-1.281-.404zm-9.927 6.238l-.25-.313a.988.988 0 0 1-.192-.78l-4.82-2.85.927-.547-.983-.582L1 15.493l7.838 4.636a12.555 12.555 0 0 1-.61-.692zM12.001 14L1 7.493 12 1l11 6.495zM2.966 7.494L12 12.838l9.033-5.342L12 2.161zm7.11 8.205l-7.11-4.205.927-.547-.983-.582L1 11.493l8.3 4.91c.227-.222.487-.459.775-.704zm13.694 3.106L24 18.5l-.23-.305C23.64 18.024 20.493 14 16.5 14c-3.989 0-7.121 4.017-7.255 4.188L9 18.5l.245.312C9.379 18.982 12.51 23 16.5 23c3.993 0 7.14-4.024 7.27-4.195zM16.5 14.9c2.995 0 5.618 2.672 6.419 3.6-.799.93-3.418 3.6-6.419 3.6-2.992 0-5.565-2.663-6.4-3.6.835-.937 3.408-3.6 6.4-3.6zm2.4 3.6a2.4 2.4 0 1 0-2.4 2.4 2.403 2.403 0 0 0 2.4-2.4z"
              />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="School Name"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <textarea
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
        {errors.address && (
          <p className="text-red-600">{errors.address.message}</p>
        )}

        <input
          {...register("city", { required: "City is required" })}
          placeholder="City"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.city && <p className="text-red-600">{errors.city.message}</p>}

        <input
          {...register("state", { required: "State is required" })}
          placeholder="State"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.state && <p className="text-red-600">{errors.state.message}</p>}

        <input
          {...register("contact", {
            required: "Contact is required",
            pattern: { value: /^[0-9]+$/, message: "Contact must be numeric" },
          })}
          placeholder="Contact Number"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.contact && (
          <p className="text-red-600">{errors.contact.message}</p>
        )}

        <input
          {...register("email_id", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email_id && (
          <p className="text-red-600">{errors.email_id.message}</p>
        )}

        <input
          type="file"
          {...register("file", { required: "Image is required" })}
          accept="image/*"
          className=" p-1 border bg-gray-700"
        />
        {errors.file && <p className="text-red-600">{errors.file.message}</p>}
        <br />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Add School"}
        </button>
      </form>
    </main>
  );
}
