import { Card, CardContent } from "@mui/material";
import React from "react";

export default function JobCard({ post, index }) {
  return (
    <div>
      <Card
        sx={{
          maxWidth: 360,
          borderRadius: 5,
          padding: "5px",
          boxSizing: "border-box",
        }}
        className="jobCard"
      >
        <CardContent>
          <div>
            <div className="jobTitle">
              <div>
                <img src={post?.logoUrl} alt={post?.companyName} />
              </div>
              <div>
                <h3>{post?.companyName}</h3>
                <p>{post?.jobRole}</p>
                <p>
                  {post?.location} | Exp: {post?.minExp}-{post?.maxExp}
                </p>
                <p>
                  Estimated Salary ₹
                  {post?.minJdSalary && post.maxJdSalary
                    ? `${post?.minJdSalary} - ${post.maxJdSalary}`
                    : post?.minJdSalary
                    ? post?.minJdSalary
                    : post.maxJdSalary
                    ? post.maxJdSalary
                    : 0}{" "}
                  LPA
                </p>
              </div>
            </div>
            <h3>Job Description:</h3>
            <p>{post?.jobDetailsFromCompany}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
