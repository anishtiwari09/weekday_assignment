import React, { useEffect, useRef, useState } from "react";
import SearchFilter from "./SearchFilter/SearchFilter";
import JobSearchContext from "../context/JobSearchContext";
import { basePay, experience, jobLocationType, jobRolesData } from "../db/data";
import JobPostContainer from "./JobPostContainer";
import { Box, CircularProgress } from "@mui/material";
import { fetchJobPost } from "../api";
const LIMIT = 6;
export default function JobSearch() {
  let [lastIndex, setLastIndex] = useState(0);
  const loaderRef = useRef(null);
  const loaderTimerRef = useRef(null);
  const filterChangeRef = useRef(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoader, setInitialLoader] = useState(true);
  const [allData, setAllData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [currentShowingData, setCurrentShowingData] = useState([]);
  const [availableFilter, setAvailableFilter] = useState({
    roles: {
      type: "roles",
      data: jobRolesData,
      method: null,
    },
    minExperience: {
      type: "minExperience",
      data: experience,
    },
    jobLocationType: {
      type: "jobLocationType",
      data: jobLocationType,
    },
    minBasePay: {
      type: "minBasePay",
      data: basePay,
    },
  });
  const fetchAllData = async () => {
    const myHeaders = new Headers();
    const body = JSON.stringify({
      limit: 947,
      offset: 0,
    });
    myHeaders.append("Content-Type", "application/json");

    try {
      let data = await fetchJobPost(body);
      let jdList = data?.data?.jdList || [];
      jdList = jdList.filter((item) => {
        return (
          item.location &&
          item?.minExp !== null &&
          item?.maxExp !== null &&
          item?.maxJdSalary !== null &&
          item?.minJdSalary &&
          item?.companyName &&
          item?.jobRole
        );
      });

      let selectedData = [];
      for (var i = 0; i < 6 && i < jdList.length; i++) {
        selectedData.push(jdList[i]);
        setCurrentShowingData(selectedData);
      }
      setLastIndex(i);

      setAllData(jdList || []);
    } catch (e) {
      console.log(e);
    }
    setInitialLoader(false);
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  useEffect(() => {
    if (selectedFilter && allData?.length) {
      setLastIndex(0);

      clearTimeout(filterChangeRef.current);
      clearTimeout(loaderTimerRef.current);
      setIsLoading(false);
      setFilterLoading(true);
      filterChangeRef.current = setTimeout(() => {
        addNewData(0);
        setFilterLoading(false);
        filterChangeRef.current = null;
      }, 2000);
    }
  }, [selectedFilter]);
  function afterApplyingFilter(filter, allData, startIndex) {
    let i = startIndex;
    let count = 0;
    let data = [];

    while (count < 6 && i < allData.length) {
      let isFlag = true;
      let item = allData[i];
      let roles = filter["roles"] || [];

      if (roles.length) {
        roles = roles.filter((role) => {
          let value1 = role?.value || "";
          value1 = value1.toLowerCase()?.trim();
          let value2 = item?.jobRole || "";
          value2 = value2.toLowerCase()?.trim();
          return value1 === value2;
        });
        if (!roles.length) {
          isFlag = false;
        }
      }

      let minExperiece = filter["minExperience"] || "";

      if (minExperiece) {
        minExperiece = Number(minExperiece) || 0;

        let currentItemMinExperience = Number(item?.minExp) || 0;
        if (currentItemMinExperience !== minExperiece) {
          isFlag = false;
        }
      }

      let minBasePay = filter["minBasePay"]?.value || "";
      if (minBasePay) {
        minBasePay = Number(minBasePay) || 0;
        let temp = Number(item?.minJdSalary) || 0;

        if (temp < minBasePay) {
          isFlag = false;
        }
      }

      let jobLocationType = filter["jobLocationType"]?.value || "";
      if (jobLocationType) {
        let temp = item?.location || "";
        temp = temp.trim()?.toLowerCase();
        jobLocationType = jobLocationType?.toLowerCase();
        if (jobLocationType === "remote") {
          if (temp !== "remote") isFlag = false;
        } else {
          if (temp === "remote") isFlag = false;
        }
      }
      let location = filter["location"] || "";
      if (location) {
        let temp = item?.location || "";
        temp = temp.trim()?.toLowerCase();
        location = location.trim()?.toLowerCase();
        if (!temp.includes(location)) {
          isFlag = false;
        }
      }
      let companyName = filter["companyName"] || "";
      console.log(companyName);
      if (companyName) {
        let temp = item?.companyName || "";
        companyName = companyName.trim()?.toLowerCase();
        temp = temp.trim()?.toLowerCase();
        if (!temp.includes(companyName)) {
          isFlag = false;
        }
      }

      if (isFlag) {
        data.push(item);
        count++;
      }
      i++;
    }
    setLastIndex(i);

    return data;
  }
  const addNewData = (startIndex) => {
    setSelectedFilter((filter) => {
      setCurrentShowingData((data) => {
        let newData = afterApplyingFilter(filter, allData, startIndex);

        setIsLoading(false);
        return startIndex === 0
          ? newData
          : newData.length
          ? [...data, ...newData]
          : data;
      });

      return filter;
    });
  };

  useEffect(() => {
    if (loaderRef.current) {
      const observer = new IntersectionObserver((enteries) => {
        let entry = enteries[0];
        if (entry?.isIntersecting && !filterChangeRef.current) {
          setLastIndex((prev) => {
            if (prev < allData.length) {
              setIsLoading(true);
              clearTimeout(loaderTimerRef.current);
              loaderTimerRef.current = setTimeout(() => {
                addNewData(prev);
              }, 5000);
            }
            return prev;
          });
        }
      });

      observer.observe(loaderRef.current);
      return () => {
        observer.unobserve(loaderRef.current);
        clearTimeout(loaderTimerRef.current);
      };
    }
  }, [allData.length]);
  return (
    <div className="mainContainer">
      {initialLoader ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <JobSearchContext.Provider
          value={{
            availableFilter,
            selectedFilter,
            setSelectedFilter,
            setAvailableFilter,
          }}
        >
          <SearchFilter />
          {filterLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : currentShowingData?.length ? (
            <JobPostContainer data={currentShowingData} />
          ) : (
            <h3>No Data found...</h3>
          )}
          <div ref={loaderRef}>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
          </div>
        </JobSearchContext.Provider>
      )}
    </div>
  );
}
