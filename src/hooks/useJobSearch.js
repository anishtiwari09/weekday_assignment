import { useContext } from "react";
import JobSearchContext from "../context/JobSearchContext";

export default function useJobSearch() {
  const context = useContext(JobSearchContext);
  return context;
}
