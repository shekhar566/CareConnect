"use server";

import { JobFilterParams } from "@/lib/actions/shared.types";

export const fetchLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const location = await response.json();
    return location.country_name;
  } catch (error) {
    console.error("Error fetching location", error);
    return "United States";
  }
};

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page } = filters;

  const searchTerm = query || "Physician Medical Doctor Nurse Hospital";

  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${searchTerm}&page=${page}&num_pages=1`,
      {
        headers,
      }
    );

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
