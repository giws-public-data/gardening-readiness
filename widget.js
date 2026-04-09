(function () {
  const DATA_URL = "data.json";

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

    // Create container if it doesn't already exist
    let metricsContainer = document.getElementById("metrics");
    if (!metricsContainer) {
      metricsContainer = document.createElement("section");
      metricsContainer.id = "metrics";

      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Supporting data";
      details.appendChild(summary);

      const list = document.createElement("ul");
      details.appendChild(list);

      metricsContainer.appendChild(details);

      const widget = document.querySelector(".widget");
      widget.insertBefore(metricsContainer, widget.querySelector("footer"));
    }

    const list = metricsContainer.querySelector("ul");
    list.innerHTML = "";

    data.metrics.forEach(metric => {
      const item = document.createElement("li");

      const label = document.createElement("strong");
      label.textContent = metric.label + ": ";

      const value = document.createElement("span");
      value.textContent = formatValue(metric);

      item.appendChild(label);
      item.appendChild(value);

      if (metric.interpretation) {
        const note = document.createElement("div");
        note.className = "metric-note";
        note.textContent = metric.interpretation;
        item.appendChild(note);
      }

      list.appendChild(item);
    });
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
