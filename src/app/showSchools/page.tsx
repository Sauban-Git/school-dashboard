"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  image: string;
};

export default function ShowSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schools/list")
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Schools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {schools.map(({ id, name, address, city, image }) => (
          <div
            key={id}
            className="border rounded shadow hover:shadow-lg overflow-hidden"
          >
            <div className="overflow-hidden">
              <Image
                width={512}
                height={512}
                src={`/${image}`}
                alt={name}
                className="w-full h-48 object-cover hover:scale-110 duration-300"
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
    </main>
  );
}
