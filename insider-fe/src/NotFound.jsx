import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Empty className="flex flex-col items-center justify-center min-h-[400px]">
      <EmptyHeader className="text-center">

        <div className="flex items-center gap-2 px-2 py-3">
          <img width="33px" src="/insider-icon.svg" />
          <img width="90px" src="/insider-text.svg" />
        </div>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          Halaman yang anda cari tidak ditemukan atau belum ditambahkan.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <Button
            onClick={() => navigate("/")}
          >
            Ke Home
          </Button>
        </div>

      </EmptyContent>


    </Empty>
  );
};

export default NotFound;