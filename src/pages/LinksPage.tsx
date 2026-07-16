import React, { useEffect, useState } from "react";
import { 
  BarChart3, ChevronLeft, ChevronRight, Filter, Link, 
  Search, SlidersHorizontal, Star, Trash2 
} from "lucide-react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { UrlItem } from "../types.js";
import { UrlCard } from "../components/UrlCard.js";
import { UrlListSkeleton } from "../components/Skeletons.js";

export const LinksPage: React.FC = () => {
  const { toast } = useToast();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [search, setSearch] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [favorite, setFavorite] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("createdAt_desc");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6); // 6 links per page
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUrls, setTotalUrls] = useState<number>(0);

  const fetchUrls = async () => {
    setIsLoading(true);
    try {
      const data = await api.url.list({
        search: search.trim() || undefined,
        tag: tag.trim() || undefined,
        favorite: favorite || undefined,
        sort,
        page,
        limit,
      });
      setUrls(data.urls);
      setTotalPages(data.pagination.pages);
      setTotalUrls(data.pagination.total);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load shortened links.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch URLs when filters or page changes
  useEffect(() => {
    fetchUrls();
  }, [search, tag, favorite, sort, page]);

  // Reset page when filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setTag("");
    setFavorite(false);
    setSort("createdAt_desc");
    setPage(1);
    toast.success("Filters cleared!");
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="border-b border-gray-150 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display" id="links-page-title">
          My Shortened Links
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Manage your link cuts, trace single redirection clicks, and configure lock settings.
        </p>
      </div>

      {/* Filters Toolbar Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-gray-400 dark:text-zinc-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-950 text-xs sm:text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-medium"
            placeholder="Search original URL, short code, or tags..."
            id="url-search-input"
          />
        </div>

        {/* Filter Selection Panel */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tag Selector */}
          <div className="relative">
            <input
              type="text"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                handleFilterChange();
              }}
              className="px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 text-xs border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl max-w-[120px] font-semibold"
              placeholder="Filter Tag"
              id="url-tag-input"
            />
          </div>

          {/* Favorites Star Toggle */}
          <button
            onClick={() => {
              setFavorite(!favorite);
              handleFilterChange();
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              favorite
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                : "bg-gray-50 dark:bg-zinc-950 border-gray-150 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
            id="fav-filter-btn"
          >
            <Star className={`w-3.5 h-3.5 ${favorite ? "fill-current text-amber-500" : ""}`} />
            Favorites Only
          </button>

          {/* Sort selector */}
          <div className="relative font-semibold text-xs">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                handleFilterChange();
              }}
              className="appearance-none px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 rounded-xl text-xs font-semibold text-gray-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
              id="url-sort-select"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="clicks_desc">Most Visited</option>
              <option value="clicks_asc">Least Visited</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(search || tag || favorite || sort !== "createdAt_desc") && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-gray-400 hover:text-rose-500 transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main URLs display area */}
      {isLoading ? (
        <UrlListSkeleton />
      ) : urls.length === 0 ? (
        <div className="p-10 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl text-center shadow-sm space-y-4 max-w-lg mx-auto mt-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Link className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-gray-800 dark:text-zinc-200 font-display">No Shortened URLs Found</h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
              We couldn't find any shortened URLs matching your active filter criteria. Try clearing search filters or cut a new URL!
            </p>
          </div>
          <button
            onClick={() => {
              window.location.hash = "#/create";
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-blue-600/10 cursor-pointer"
          >
            Shorten New URL
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* List stats */}
          <div className="text-xs text-gray-400 dark:text-zinc-500 font-bold px-1 uppercase tracking-wider">
            Showing {urls.length} of {totalUrls} results
          </div>

          {/* Cards Stack */}
          <div className="grid grid-cols-1 gap-4">
            {urls.map((item) => (
              <UrlCard key={item.id} url={item} onUpdate={fetchUrls} onDelete={fetchUrls} />
            ))}
          </div>

          {/* Pagination Controls Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 select-none">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-gray-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-zinc-300" />
              </button>

              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                Page <span className="font-bold text-gray-800 dark:text-zinc-200">{page}</span> of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-gray-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-zinc-300" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
