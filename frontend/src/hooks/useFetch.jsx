import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useFetch = (url) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setApiData([]); // Set empty array for 404
            setError(null);
          } else {
            const errorMsg = `Failed to fetch: ${response.status} ${response.statusText}`;
            setError(errorMsg);
            toast.error(errorMsg);
          }
          return;
        }

        const result = await response.json();
        setApiData(result.data || result);
        setError(null);
        
      } catch (error) {
        const errorMsg = error.message || 'Network error occurred';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [url]);

  // Refetch function for manual data refresh
  const refetch = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to refetch');
      }
      const result = await response.json();
      setApiData(result.data || result);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { 
    apiData, 
    loading, 
    error,
    refetch,
    isEmpty: !apiData || (Array.isArray(apiData) && apiData.length === 0)
  };
};

export default useFetch;