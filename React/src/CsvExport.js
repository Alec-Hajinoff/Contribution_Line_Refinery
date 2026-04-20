import React from "react";

const CsvExport = ({ contributions }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const escapeCsvField = (field) => {
    if (field === null || field === undefined) return "";
    const stringField = String(field);

    if (
      stringField.includes(",") ||
      stringField.includes('"') ||
      stringField.includes("\n")
    ) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const generateCsv = () => {
    const headers = [
      "Contribution title",
      "Contribution date",
      "Contribution logged",
      "What happened",
      "Why it mattered",
      "Outcome & impact",
      "Current role",
      "Current company",
    ];

    const rows = contributions.map((item) => [
      escapeCsvField(item.title || ""),
      escapeCsvField(formatDate(item.contribution_date)),
      escapeCsvField(formatDate(item.created_at)),
      escapeCsvField(item.what_happened || ""),
      escapeCsvField(item.why_it_mattered || ""),
      escapeCsvField(item.outcome_impact || ""),
      escapeCsvField(item.current_role || ""),
      escapeCsvField(item.current_company || ""),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const handleExport = () => {
    if (contributions.length === 0) {
      alert("No contributions to export.");
      return;
    }

    const csvContent = generateCsv();

    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    const filename = `contributions_export_${formattedDate}.csv`;

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="btn btn-sm btn-secondary me-2"
      onClick={handleExport}
      title="Export all contributions to CSV"
    >
      <span role="img" aria-label="export">
        📥
      </span>{" "}
      Export as CSV
    </button>
  );
};

export default CsvExport;
