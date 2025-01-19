import React, { useState, useEffect } from "react";
import Searchbar from "./SearchBar";

type IssueProps = {
  title: string;
  url: string;
  tags: string[];
};

function Issue({ title, url, tags }: IssueProps) {
  return (
    <div className="p-4 mb-2 bg-[#4A665A]/[.18] rounded-lg text-white flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </h3>
        <span className="text-xs px-2 py-1 bg-green-500 rounded-full">
          {tags.join(", ")}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        Tags: {tags.length > 0 ? tags.join(", ") : "No tags"}
      </p>
    </div>
  );
}

const IssueTab = () => {
  const [issues, setIssues] = useState<IssueProps[]>([]); // Holds issues fetched from backend
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    // Simulate a fetch request to the backend with the specific JSON structure
    setTimeout(() => {
      const fetchedIssues = [
        {
          title: "verifyOtp fails with otp_expired",
          url: "http://example.com/issues/1",
          tags: ["bug", "external-issue", "to-triage"]
        },
        {
          title: "Can't Delete User on Locally Deployed Supabase",
          url: "http://example.com/issues/2",
          tags: ["external-issue", "to-triage"]
        },
        // Add more issues here following the same structure
      ];
      setIssues(fetchedIssues); // Set fetched issues to state
    }, 1000); // Simulating a 1-second delay for fetching data
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag); // Toggle tag selection
  };

  const filterIssues = (issue: typeof issues[number]) => {
    const matchesTag = selectedTag ? issue.tags.includes(selectedTag) : true;
    const matchesSearchTerm = searchTerm
      ? issue.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesTag && matchesSearchTerm;
  };

  return (
    <div className="bg-[#4A665A]/[.18] rounded-2xl p-4 flex flex-col">
      {/* Search Bar */}
      <div className="mb-4">
        <Searchbar
          onChangeCallBack={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
        />
      </div>

      {/* Tags Bar */}
      <div className="flex gap-4 mb-4">
        {["bug", "external-issue", "to-triage", "enhancement", "documentation"].map((tag) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-lg border ${
              selectedTag === tag ? "bg-[#4A665A]/[.18] text-255540" : "bg-[#4A665A]/[.18] text-255540"
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="flex-1">
        {issues.filter(filterIssues).map(({ title, url, tags }, index) => (
          <Issue
            key={index}
            title={title}
            url={url}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
};

export default IssueTab;
