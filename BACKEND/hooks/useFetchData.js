const { default: axios } = require("axios");
const { useState, useEffect } = require("react");

function useFetchData(apiEndpoint) {
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setLoading(false);
      return;

    }

    setLoading(true);

    const fetchAllData = async () => {

      try {
        const res = await axios.get(apiEndpoint);
        const alldata = res.data;
        setAlldata(alldata);
        setLoading(false)
      } catch (error) {
        setLoading(false);
      }
    }

    //frtch blog data only if category exits
    if (apiEndpoint) {
      fetchAllData()

    }
  }, [initialLoad, apiEndpoint]); //depend on initialled and api end point to trigger apicall

  return { alldata, loading }



}

export default useFetchData;