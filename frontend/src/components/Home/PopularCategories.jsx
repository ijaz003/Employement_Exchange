import React from "react";
import useAxios from "../../hooks/useAxios";
import { useTheme } from '../../contexts/ThemeContext';

const PopularCategories = () => {
  const axios = useAxios();
  const { isDark } = useTheme();
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    axios.get("/job/latest")
      .then(res => {
        if (res.data.success && Array.isArray(res.data.jobs)) {
          setJobs(res.data.jobs);
        } else {
          setJobs([]);
        }
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);


  // Extract unique categories and their job counts
  const categoryMap = {};
  jobs.forEach(job => {
    if (job.category) {
      if (!categoryMap[job.category]) {
        categoryMap[job.category] = 1;
      } else {
        categoryMap[job.category]++;
      }
    }
  });
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9); // Only show up to 9 actual categories

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-primary-400' : 'text-slate-900'}`}>Popular Categories</h2>
          <p className={`mt-2 ${isDark ? 'text-primary-200' : 'text-slate-600'}`}>Explore the most in-demand job categories</p>
        </div>
        {loading ? (
          <div className="text-center text-slate-500">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 dark:text-slate-400">No categories found.</div>
            ) : (
              categories.map(([category, count]) => (
                <div
                  key={category}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-md hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900 group-hover:bg-sky-200 dark:group-hover:bg-sky-800 mb-2">
                    <svg className="w-7 h-7 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">{category}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{count} job{count > 1 ? 's' : ''} available</p>
                  {/* <a href={`/jobs/category/${encodeURIComponent(category)}`} className="mt-2 text-sky-600 dark:text-sky-400 font-semibold hover:underline">View Jobs</a> */}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCategories;
