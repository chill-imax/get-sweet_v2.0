import { useState, useEffect } from "react";
import { useAuth } from "@/context/useContext";

export const useCompetitorAnalysis = () => {
  const { token, user } = useAuth();

  // --- STATE ---
  const [searchMode, setSearchMode] = useState("auto");
  const [companyProfile, setCompanyProfile] = useState(null);
  const [formData, setFormData] = useState({
    niche: "",
    location: "",
    url: "",
  });

  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [savedCompetitors, setSavedCompetitors] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const [activeTab, setActiveTab] = useState("search");
  const [selectedItems, setSelectedItems] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // --- EFECTOS ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success) setCompanyProfile(data.data || data);
      } catch (err) {
        console.error("Error fetching profile");
      }
    };
    fetchProfile();
  }, [user, token]);

  useEffect(() => {
    if (activeTab === "library" && user?._id) {
      fetchSavedCompetitors();
    }
  }, [activeTab, user]);

  // --- API ACTIONS ---
  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchResult(null);
    setSelectedItems([]);

    const payload = {
      mode: searchMode,
      userId: user._id,
      customNiche: formData.niche,
      customLocation: formData.location,
      specificUrl: formData.url,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/competitors/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Error searching competitors");
      const data = await response.json();
      setSearchResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCompetitors = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/competitors/list/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) setSavedCompetitors(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleSave = async (competitorOrList) => {
    const itemsToSave = Array.isArray(competitorOrList)
      ? competitorOrList
      : [competitorOrList];
    try {
      for (const comp of itemsToSave) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/competitors/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: user._id, competitorData: comp }),
          }
        );
      }
      setSuccessMsg(`Saved ${itemsToSave.length} competitors!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setOpenMenuId(null);
      setSelectedItems([]);
    } catch (err) {
      setError("Error saving competitor");
    }
  };

  const handleDelete = async (comp) => {
    if (activeTab === "search") {
      alert("Removed from view");
      return;
    }
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/competitors/delete/${comp._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSavedCompetitors();
      setSuccessMsg("Deleted successfully");
    } catch (err) {
      setError("Error deleting");
    }
  };

  // --- HELPERS ---
  const toggleSelection = (url) => {
    if (selectedItems.includes(url))
      setSelectedItems(selectedItems.filter((item) => item !== url));
    else setSelectedItems([...selectedItems, url]);
  };

  const toggleSelectAll = (list) => {
    if (selectedItems.length === list.length) setSelectedItems([]);
    else setSelectedItems(list.map((c) => c.url));
  };

  const isSearchDisabled = () => {
    if (loading) return true;
    if (searchMode === "auto") return !companyProfile?.industry;
    return !formData.niche && !formData.url; // Corregido para permitir solo URL
  };

  return {
    searchMode,
    setSearchMode,
    companyProfile,
    formData,
    setFormData,
    loading,
    searchResult,
    savedCompetitors,
    loadingSaved,
    activeTab,
    setActiveTab,
    selectedItems,
    toggleSelection,
    toggleSelectAll,
    openMenuId,
    setOpenMenuId,
    toggleMenu: (id) => setOpenMenuId(openMenuId === id ? null : id),
    error,
    successMsg,
    handleAnalyze,
    handleSave,
    handleDelete,
    isSearchDisabled,
    handleChange: (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value }),
  };
};
