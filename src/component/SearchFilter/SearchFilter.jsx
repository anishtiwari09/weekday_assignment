import React, { useEffect } from "react";
import { Autocomplete, Input, TextField } from "@mui/material";
import useJobSearch from "../../hooks/useJobSearch";

export default function SearchFilter() {
  let {
    availableFilter,
    setAvailableFilter,
    selectedFilter,
    setSelectedFilter,
  } = useJobSearch();
  const handleChange = (type, value) => {
    selectedFilter = selectedFilter || {};
    selectedFilter[type] = value;
    setSelectedFilter({ ...selectedFilter });
  };
  const handleTextChange = (type, value) => {
    selectedFilter = selectedFilter || {};
    selectedFilter[type] = value;
    if (type === "jobLocationType") {
      if (value?.value === "remote") {
        selectedFilter["location"] = "";
      }
    }
    setSelectedFilter({ ...selectedFilter });
  };

  return (
    <div className="searchFilterContainer">
      <div>
        <Autocomplete
          sx={{ minWidth: 200 }}
          value={selectedFilter["roles"] || []}
          multiple
          id="roles"
          options={availableFilter["roles"]["data"]}
          getOptionLabel={(role) => role.name}
          groupBy={(role) => role.group}
          onChange={(event, newValue) => handleChange("roles", newValue)}
          renderInput={(params) => {
            return <TextField {...params} label="roles" />;
          }}
        />
      </div>
      <div>
        <Autocomplete
          sx={{ minWidth: 200 }}
          value={selectedFilter["jobLocationType"] || null}
          id="remote"
          options={availableFilter["jobLocationType"]["data"]}
          getOptionLabel={(role) => role.name}
          groupBy={(role) => role.group}
          onChange={(event, newValue) =>
            handleChange("jobLocationType", newValue)
          }
          renderInput={(params) => {
            return <TextField {...params} label="Remote" />;
          }}
        />
      </div>
      <div>
        {" "}
        <Autocomplete
          sx={{ minWidth: 200 }}
          value={selectedFilter["minExperience"] || ""}
          id="minExperience"
          options={availableFilter["minExperience"]["data"]}
          getOptionLabel={(role) => role}
          onChange={(event, newValue) =>
            handleChange("minExperience", newValue)
          }
          renderInput={(params) => {
            return <TextField {...params} label="Min Experience" />;
          }}
        />
      </div>
      <div>
        {" "}
        <Autocomplete
          sx={{ minWidth: 200 }}
          value={selectedFilter["minBasePay"] || null}
          id="minbasepay"
          options={availableFilter["minBasePay"]["data"]}
          getOptionLabel={(role) => role.name}
          onChange={(event, newValue) => handleChange("minBasePay", newValue)}
          renderInput={(params) => {
            return <TextField {...params} label="Min Base pay" />;
          }}
        />
      </div>
      <div>
        <TextField
          placeholder="Company Name"
          sx={{ minWidth: 200 }}
          onChange={(e) => handleTextChange("companyName", e.target.value)}
        />
      </div>
      <div>
        {selectedFilter?.jobLocationType?.value === "remote" ? (
          ""
        ) : (
          <TextField
            placeholder="Location"
            sx={{ minWidth: 200 }}
            onChange={(e) => handleTextChange("location", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
