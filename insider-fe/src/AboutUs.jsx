import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

export default function About() {
  return (
    <div className=" mx-auto py-6 sm:px-20 px-4 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight">
          TIF insider
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Market Capture Intelligence Platform
        </p>
      </div>

      {/* Mission */}
      <Card>
        <CardHeader>
          <CardTitle className="uppercase tracking-tight">
            Mission Control
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Highlight quote */}
          <p className="text-xl font-semibold italic border-l-4 border-primary pl-4 ">
            "Accelerating Market-Driven Infrastructure Growth"
          </p>

          <p className="text-muted-foreground leading-relaxed text-justify">
            <span className="font-semibold text-foreground">Insider</span> is the Commercial Dashboard of{" "}
            <span className="font-semibold">PT Telekomunikasi Indonesia Infrastruktur (TIF)</span>, 
            developed as part of the <span>TIF Commercial Strategy 2025</span>. 
            Initiated under the <span>Product Strategy & Innovation Unit</span>, 
            this platform reflects a strong commitment to{" "}
            <span className="font-semibold ">innovation-driven commercial execution</span>.
          </p>

          <div className="space-y-6">

            <div>
              <h3 className="font-semibold text-lg">
                Platform Foundation — 2025
              </h3>
              <p className="text-muted-foreground text-justify">
                Established to strengthen <span>ISP profiling capabilities</span> 
                and enhance <span>competitive visibility</span> across Indonesia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Intelligence Expansion — 2026
              </h3>
              <p className="text-muted-foreground text-justify">
                Expanded with <span>residential demand intelligence</span>, 
                transforming Insider into a{" "}
                <span className="font-semibold ">
                  precision market capture engine
                </span>.
              </p>
            </div>

          </div>

        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2  gap-8">

        <Card>
          <CardHeader>
            <CardTitle className="uppercase">
              Strategic Intelligence
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div>
              <h3 className="font-semibold text-lg">
                Intelligence Integration
              </h3>
              <p className="text-muted-foreground text-justify">
                Combines <span>SP distribution</span>,{" "}
                <span>residential density</span>, and{" "}
                <span>infrastructure readiness</span> 
                to deliver a <span className="font-semibold">holistic market view</span>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Strategic Outcomes
              </h3>
              <p className="text-muted-foreground text-justify">
                Focused on capturing{" "}
                <span className="font-semibold ">
                  high-growth opportunities
                by activating underutilized assets</span> 
                and executing <span>offensive expansion strategies</span>.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="uppercase">
              Usage Framework
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div>
              <h3 className="font-semibold text-lg">
                Decode the Market Landscape
              </h3>
              <p className="text-muted-foreground text-justify">
                Understand <span>ISP footprint and
                density patterns</span> 
                to identify competition and growth hotspots.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Detect Untapped Demand
              </h3>
              <p className="text-muted-foreground text-justify">
                Identify <span>underserved clusters
                aligned with existing infrastructure</span>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Execute High-Impact Expansion
              </h3>
              <p className="text-muted-foreground text-justify">
                Prioritize <span className="font-semibold ">
                  monetizable zones
                </span>{" "}
                for scalable growth.
              </p>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Footer */}
      <Card>
        <CardContent className="flex flex-col md:flex-row justify-between gap-6">

          <div>
            <p className="font-semibold">
              Market Capture Intelligence Platform
            </p>
            <p className="text-muted-foreground">
              PT Telekomunikasi Indonesia Infrastruktur
            </p>
          </div>

          <div className="space-y-2 text-sm flex flex-col items-end">
            <p>
              <span className="font-semibold">
                amy.maryana@tif.co.id
              </span>
            </p>

            <p>
              <span className="font-semibold">
                +62 811 8903 08
              </span>
            </p>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}