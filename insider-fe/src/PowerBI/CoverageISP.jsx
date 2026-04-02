import { api } from "@/lib/common";
import { PowerBIViewer } from "@/components/PowerBIViewer";
import { useEffect, useState } from "react";

export default function CoverageIspPage() {
  const [link, setLink] = useState([]);
  const name = "COVERAGE ISP";

  useEffect(() => {
    fetchLink();
    
  }, [])

  const fetchLink = async () => {
    try {
      const { data } = await api.get("/pbi-link?name=" + name);
      setLink(data.link);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  
  return (
    <PowerBIViewer link={link} />
  );
}
