import React from "react";
import "./TimelineFilter.css";

const TimelineFilter = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="timeline-filter">
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title h6 mb-3">Filter contributions</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Start date</label>
              <input
                type="date"
                name="startDate"
                className="form-control form-control-sm"
                value={filters.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">End date</label>
              <input
                type="date"
                name="endDate"
                className="form-control form-control-sm"
                value={filters.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-link btn-sm text-muted text-decoration-none"
              onClick={onClear}
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineFilter;
