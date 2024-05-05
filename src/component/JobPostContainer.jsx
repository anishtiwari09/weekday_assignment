import React from "react";
import JobCard from "./JobCard";

export default function JobPostContainer({ data }) {
  return (
    <div class="jobContainer">
      {data?.map((post, i) => (
        <JobCard id={post?.id} post={post} index={i} />
      ))}
    </div>
  );
}
