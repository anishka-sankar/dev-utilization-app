import { RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";

const SettingsView = ({ onDataRefresh }) => {
  const [azureConfig, setAzureConfig] = useState({
    organization_url: "",
    project_name: "",
    personal_access_token: "",
  });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadAzureConfig();
  }, []);

  const loadAzureConfig = async () => {
    try {
      const res = await api.get(`/api/azure-config`);
      if (res.data) {
        setAzureConfig(res.data);
      }
    } catch (error) {
      console.error("Failed to load Azure config");
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/azure-config`, azureConfig);
      toast.success("Azure DevOps configuration saved");
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.post(`/api/sync-azure-boards`);
      toast.success(
        `Synced ${res.data.synced_count} work items from Azure DevOps`,
      );
      onDataRefresh();
    } catch (error) {
      toast.error("Failed to sync with Azure DevOps");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="settings-view">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure Azure DevOps integration</p>
      </div>

      <div className="settings-content">
        <div className="settings-card">
          <h2>Azure DevOps Configuration</h2>
          <form onSubmit={handleSaveConfig}>
            <div className="form-group">
              <label>Organization URL</label>
              <input
                type="text"
                value={azureConfig.organization_url}
                onChange={(e) =>
                  setAzureConfig({
                    ...azureConfig,
                    organization_url: e.target.value,
                  })
                }
                placeholder="https://dev.azure.com/yourorganization"
              />
            </div>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={azureConfig.project_name}
                onChange={(e) =>
                  setAzureConfig({
                    ...azureConfig,
                    project_name: e.target.value,
                  })
                }
                placeholder="YourProjectName"
              />
            </div>
            <div className="form-group">
              <label>Personal Access Token</label>
              <input
                type="password"
                value={azureConfig.personal_access_token}
                onChange={(e) =>
                  setAzureConfig({
                    ...azureConfig,
                    personal_access_token: e.target.value,
                  })
                }
                placeholder="Enter your PAT"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <Save size={18} />
                Save Configuration
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw size={18} className={syncing ? "spinning" : ""} />
                {syncing ? "Syncing..." : "Sync from Azure DevOps"}
              </button>
            </div>
          </form>
        </div>

        <div className="settings-card">
          <h2>About</h2>
          <p>Developer Utilization & Monitoring Platform</p>
          <p>Version 1.0.0</p>
          <p>
            Track, monitor, and optimize your development team's productivity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
