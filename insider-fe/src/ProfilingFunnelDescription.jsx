import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export default function ProfilingFunnelDescription() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-extrabold text-3xl tracking-tight">
          Profiling Funnel Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:px-28 px-6">
        <p className="text-lg text-justify">
          TIF Addressable Customer 2026–2028 memetakan 1.318 ISP berlisensi
          (2025) berdasarkan segmentasi Size, Quality, dan Risk untuk menentukan
          prioritas penetrasi pasar secara terstruktur. Melalui pendekatan ICP,
          strategi difokuskan pada High ISP sebagai strategic wholesale partner,
          Middle ISP untuk akselerasi growth melalui skema WL terarah, serta Low
          ISP dengan selective engagement guna menjaga keseimbangan ekspansi dan
          pengelolaan risiko.
        </p>
        {/* Container that controls the maximum width and centers the image */}
        <div className="mx-auto w-full">
          <div className="relative aspect-[16/10] w-full">
            <img
              src="/funnel-1.webp"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <p className="text-lg text-justify">
          ISP Market Segmentation dirancang menggunakan empat pilar
          strategis—Size, Quality, Geographics, dan Risk—untuk memberikan
          penilaian komprehensif terhadap potensi dan keberlanjutan bisnis
          setiap ISP. Pendekatan ini memungkinkan perusahaan memprioritaskan dan
          menentukan strategi bisnis serta mengelola risiko secara lebih terukur
          dan berbasis data.
        </p>
        {/* Container that controls the maximum width and centers the image */}
        <div className="mx-auto w-full">
          <div className="relative aspect-[16/10] w-full">
            <img
              src="/funnel-2.webp"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
