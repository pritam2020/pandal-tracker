import { useEffect, useMemo, useState } from 'react';
import './admin.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const emptyPandal = {
  name: '',
  zone: '',
  maps: '',
  adminNote: '',
  uncertain: false,
};

function Admin() {
  const [zones, setZones] = useState([]);
  const [pandals, setPandals] = useState([]);

  const [zoneName, setZoneName] = useState('');
  const [editingZoneId, setEditingZoneId] = useState(null);

  const [pandalForm, setPandalForm] = useState(emptyPandal);
  const [editingPandalId, setEditingPandalId] = useState(null);

  const [selectedZone, setSelectedZone] = useState('all');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [zonesResponse, pandalsResponse] = await Promise.all([
        fetch(`${API_URL}/zones`),
        fetch(`${API_URL}/pandals`),
      ]);

      if (!zonesResponse.ok) {
        throw new Error('Failed to load zones');
      }

      if (!pandalsResponse.ok) {
        throw new Error('Failed to load pandals');
      }

      const zonesData = await zonesResponse.json();
      const pandalsData = await pandalsResponse.json();

      setZones(zonesData);
      setPandals(pandalsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // -----------------------------
  // Zone CRUD
  // -----------------------------

  const submitZone = async (event) => {
    event.preventDefault();

    if (!zoneName.trim()) {
      return;
    }

    try {
      setError('');

      const url = editingZoneId
        ? `${API_URL}/zones/${editingZoneId}`
        : `${API_URL}/zones`;

      const method = editingZoneId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: zoneName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save zone');
      }

      setZoneName('');
      setEditingZoneId(null);

      await loadData();

      showMessage(
        editingZoneId
          ? 'Zone updated successfully'
          : 'Zone created successfully'
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const editZone = (zone) => {
    setEditingZoneId(zone._id);
    setZoneName(zone.name);
  };

  const cancelZoneEdit = () => {
    setEditingZoneId(null);
    setZoneName('');
  };

  const deleteZone = async (zone) => {
    const confirmed = window.confirm(
      `Delete "${zone.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/zones/${zone._id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete zone');
      }

      await loadData();

      showMessage('Zone deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // Pandal CRUD
  // -----------------------------

  const handlePandalChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPandalForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitPandal = async (event) => {
    event.preventDefault();

    if (!pandalForm.name.trim()) {
      setError('Pandal name is required');
      return;
    }

    if (!pandalForm.zone) {
      setError('Please select a zone');
      return;
    }

    try {
      setError('');

      const url = editingPandalId
        ? `${API_URL}/pandals/${editingPandalId}`
        : `${API_URL}/pandals`;

      const method = editingPandalId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pandalForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save pandal');
      }

      setPandalForm(emptyPandal);
      setEditingPandalId(null);

      await loadData();

      showMessage(
        editingPandalId
          ? 'Pandal updated successfully'
          : 'Pandal created successfully'
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const editPandal = (pandal) => {
    setEditingPandalId(pandal._id);

    setPandalForm({
      name: pandal.name || '',
      zone: pandal.zone?._id || '',
      maps: pandal.maps || '',
      adminNote: pandal.adminNote || '',
      uncertain: Boolean(pandal.uncertain),
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const cancelPandalEdit = () => {
    setEditingPandalId(null);
    setPandalForm(emptyPandal);
  };

  const deletePandal = async (pandal) => {
    const confirmed = window.confirm(
      `Delete "${pandal.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/pandals/${pandal._id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete pandal');
      }

      await loadData();

      showMessage('Pandal deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPandals = useMemo(() => {
    if (selectedZone === 'all') {
      return pandals;
    }

    return pandals.filter(
      (pandal) => pandal.zone?._id === selectedZone
    );
  }, [pandals, selectedZone]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        <header className="admin-header">
          <div>
            <h1>Durga Puja Admin Panel</h1>
            <p>
              Manage zones and pandals for the Pandal Tracker.
            </p>
          </div>

          <a href="/" className="back-button">
            ← Tracker
          </a>
        </header>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="admin-grid">

          {/* Zone Management */}

          <section className="admin-card">
            <div className="card-header">
              <div>
                <h2>
                  {editingZoneId
                    ? 'Edit Zone'
                    : 'Add Zone'}
                </h2>

                <p>
                  Create and organize pandal areas.
                </p>
              </div>
            </div>

            <form onSubmit={submitZone}>
              <label>
                Zone name
                <input
                  type="text"
                  value={zoneName}
                  onChange={(event) =>
                    setZoneName(event.target.value)
                  }
                  placeholder="e.g. Jodhpur Park"
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  {editingZoneId
                    ? 'Update Zone'
                    : 'Add Zone'}
                </button>

                {editingZoneId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cancelZoneEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="item-list">
              {zones.map((zone) => (
                <div className="list-item" key={zone._id}>
                  <div>
                    <strong>{zone.name}</strong>

                    <span>
                      {
                        pandals.filter(
                          (pandal) =>
                            pandal.zone?._id === zone._id
                        ).length
                      }{' '}
                      pandal(s)
                    </span>
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => editZone(zone)}
                      className="small-button"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteZone(zone)}
                      className="small-button danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pandal Form */}

          <section className="admin-card">
            <div className="card-header">
              <div>
                <h2>
                  {editingPandalId
                    ? 'Edit Pandal'
                    : 'Add Pandal'}
                </h2>

                <p>
                  Add a pandal to an existing zone.
                </p>
              </div>
            </div>

            <form onSubmit={submitPandal}>

              <label>
                Pandal name
                <input
                  type="text"
                  name="name"
                  value={pandalForm.name}
                  onChange={handlePandalChange}
                  placeholder="e.g. Mudiali Club"
                />
              </label>

              <label>
                Zone

                <select
                  name="zone"
                  value={pandalForm.zone}
                  onChange={handlePandalChange}
                >
                  <option value="">
                    Select zone
                  </option>

                  {zones.map((zone) => (
                    <option
                      value={zone._id}
                      key={zone._id}
                    >
                      {zone.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Map link

                <input
                  type="url"
                  name="maps"
                  value={pandalForm.maps}
                  onChange={handlePandalChange}
                  placeholder="https://maps.google.com/..."
                />
              </label>

              <label>
                Admin note

                <textarea
                  name="adminNote"
                  value={pandalForm.adminNote}
                  onChange={handlePandalChange}
                  placeholder="Any information about this pandal..."
                  rows="4"
                />
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="uncertain"
                  checked={pandalForm.uncertain}
                  onChange={handlePandalChange}
                />

                Mark as uncertain
              </label>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingPandalId
                    ? 'Update Pandal'
                    : 'Add Pandal'}
                </button>

                {editingPandalId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cancelPandalEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* Pandal List */}

        <section className="admin-card pandal-management">

          <div className="card-header">
            <div>
              <h2>Manage Pandals</h2>

              <p>
                {filteredPandals.length} pandal(s)
              </p>
            </div>

            <select
              value={selectedZone}
              onChange={(event) =>
                setSelectedZone(event.target.value)
              }
              className="filter-select"
            >
              <option value="all">
                All zones
              </option>

              {zones.map((zone) => (
                <option
                  value={zone._id}
                  key={zone._id}
                >
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pandal-table-wrapper">
            <table className="pandal-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Zone</th>
                  <th>Map</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPandals.map((pandal) => (
                  <tr key={pandal._id}>

                    <td>
                      <strong>{pandal.name}</strong>
                    </td>

                    <td>
                      {pandal.zone?.name || '-'}
                    </td>

                    <td>
                      {pandal.maps ? (
                        <a
                          href={pandal.maps}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Map
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td>
                      {pandal.adminNote || '-'}
                    </td>

                    <td>
                      {pandal.uncertain ? (
                        <span className="status uncertain">
                          Uncertain
                        </span>
                      ) : (
                        <span className="status">
                          Confirmed
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="item-actions">
                        <button
                          onClick={() =>
                            editPandal(pandal)
                          }
                          className="small-button"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deletePandal(pandal)
                          }
                          className="small-button danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Admin;