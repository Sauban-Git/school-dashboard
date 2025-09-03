"use client";

import { useSchoolListStore } from "@/store/schoolListStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ShowSchools() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { setSchools, schools } = useSchoolListStore();

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/schools/list");
        const data = await res.json();
        setSchools(data);
      } catch (error) {
        console.error("Failed to load schools", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [setSchools]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-2">
        <div className="text-4xl font-bold">School Search</div>
        <div className="text-gray-600 text-xl">
          Find the right school for your child.
        </div>
        <div className="flex gap-2 border rounded-md p-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none p-3 "
            placeholder="School Name"
          />
          <button
            onClick={() => setSearch("")}
            className="p-3 bg-blue-300 rounded-md"
          >
            Clear
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4">
        <div className="flex justify-start gap-4 items-center">
          <h1 className="text-3xl font-bold mb-6">Schools</h1>
          <div className="mb-6 gap-2 flex border p-2 text-center rounded-md">
            <p className="items-center flex">Add School</p>
            <button
              className="flex items-center bg-blue-300 rounded-full p-2"
              onClick={() => router.push("/addSchool")}
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
              >
                <path d="M28,12H20V4c0-2.21-1.791-4-4-4s-4,1.79-4,4v8H4c-2.209,0-4,1.79-4,4s1.791,4,4,4h8v8c0,2.21,1.791,4,4,4s4-1.79,4-4v-8h8c2.209,0,4-1.79,4-4S30.209,12,28,12Z" />
              </svg>
            </button>
          </div>
        </div>

        {filteredSchools.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No schools found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSchools.map(({ id, name, address, city, image }) => (
              <div
                key={id}
                className="border rounded shadow hover:shadow-lg overflow-hidden
               transition-all duration-300 ease-in-out transform
               opacity-0 animate-fadeIn"
              >
                <div className="overflow-hidden">
                  <Image
                    width={512}
                    height={512}
                    src={image!}
                    alt={name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{name}</h2>
                  <p>{address}</p>
                  <p className="font-medium">{city}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
