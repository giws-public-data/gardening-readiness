(function () {
  const DATA_URL = "data.json";
  const METRIC_PRESENTATION = {
    precip_7d: {
      icon: "🌧️",
      shortLabel: "Precipitation (7 days)"
    },
    air_temp_avg_5d: {
      icon: "🌡️",
      shortLabel: "Avg air temp (5 days)"
    },
    soil_water_state: {
      icon: "💧",
      shortLabel: "Soil water state"
    }
  };
  
  fetch(DATA_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to load data.json");
      }
      return response.json();
    })
    .then(data => {
      renderStatus(data);
      renderTiming(data);
      renderMetrics(data);
    })
    .catch(error => {
      renderError(error);
    });

  function renderStatus(data) {
    if (!data.status) return;

    const statusEl = document.getElementById("status");
    const titleEl = document.getElementById("status-title");
    const messageEl = document.getElementById("status-message");

    if (!statusEl || !titleEl || !messageEl) return;

    statusEl.classList.remove("red", "yellow", "green");

    if (data.status.level) {
      statusEl.classList.add(data.status.level);
    }

    titleEl.textContent = data.status.title || "";
    messageEl.textContent = data.status.message || "";
  }

  function renderTiming(data) {
    if (!data.timing) return;

    const updatedEl = document.getElementById("last-updated");
    if (!updatedEl) return;

    updatedEl.textContent = data.timing.last_updated || "";
  }

  function renderMetrics(data) {
    if (!Array.isArray(data.metrics) || data.metrics.length === 0) return;
  
    const container = document.getElementById("metrics");
    if (!container) return;
  
    container.innerHTML = "";
  
    const grid = document.createElement("div");
    grid.className = "metric-grid";
  
    data.metrics.forEach(metric => {
      const presentation = METRIC_PRESENTATION[metric.id] || {};
  
      const item = document.createElement("div");
      item.className = "metric";
  
      const value = document.createElement("div");
      value.className = "metric-value";
  
      // Icon + numeric value
      value.textContent =
        `${presentation.icon ? presentation.icon + " " : ""}${formatValue(metric)}`;
  
      const label = document.createElement("div");
      label.className = "metric-label";
      label.textContent = presentation.shortLabel || metric.label;
  
      item.appendChild(value);
      item.appendChild(label);
      grid.appendChild(item);
    });
  
    container.appendChild(grid);
  }


  function formatValue(metric) {
    if (metric.value === undefined || metric.value === null) {
      return "";
    }

    if (metric.unit) {
      return `${metric.value} ${metric.unit}`;
    }

    return String(metric.value);
  }

  function renderError(error) {
    const statusEl = document.getElementById("status");
    if (!statusEl) return;

    statusEl.classList.remove("green", "yellow");
    statusEl.classList.add("red");

    const titleEl = document.getElementById("status-title");
    const messageEl = document.getElementById("status-message");

    titleEl.textContent = "Data unavailable";
    messageEl.textContent =
      "Current conditions could not be loaded. Please try again later.";
  }
})();
