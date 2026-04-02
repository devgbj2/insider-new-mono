import React from "react";
import { formatLabel } from "@/lib/common";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumb() {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
      <div className="flex items-center p-4 gap-4 border-b">
        <Button
          variant="outline"
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>

        <Breadcrumb>
          <BreadcrumbList>

            {/* Home */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {paths.map((segment, idx) => {
              const href = "/" + paths.slice(0, idx + 1).join("/");
              const isLast = idx === paths.length - 1;

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    {isLast ? (
                      <span>{formatLabel(segment)}</span>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={href}>{formatLabel(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}

          </BreadcrumbList>
        </Breadcrumb>
      </div>
  );
}