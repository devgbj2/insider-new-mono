import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const getVisiblePages = (currentPage, totalPages, visibleCount = 3) => {
  const half = Math.floor(visibleCount / 2)
  let start = Math.max(1, currentPage - half)
  let end   = Math.min(totalPages, start + visibleCount - 1)

  // Adjust start jika end mentok di totalPages
  if (end - start + 1 < visibleCount) {
    start = Math.max(1, end - visibleCount + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function IspPagination({ page, lastPage, setPage }) {
  const pages = getVisiblePages(page, lastPage)

  return (
    <Pagination className={'flex justify-end'}>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          />
        </PaginationItem>

        {/* First page + ellipsis */}
        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && (
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            )}
          </>
        )}

        {/* Visible pages */}
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last page + ellipsis */}
        {pages[pages.length - 1] < lastPage && (
          <>
            {pages[pages.length - 1] < lastPage - 1 && (
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => setPage(lastPage)}>
                {lastPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(prev => Math.min(prev + 1, lastPage))}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}