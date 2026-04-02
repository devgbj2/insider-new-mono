import { api } from "@/lib/common";
import { useEffect, useState } from "react";
import { PowerBIViewer } from "@/components/PowerBIViewer";

export default function OdpNasionalPage() {
  const [link, setLink] = useState([]);
  const name = "ODP NASIONAL";

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
