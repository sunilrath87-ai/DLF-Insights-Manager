
import React from 'react';
import { NewsArticle } from '../types';

interface NewsProps {
  data: NewsArticle[] | null;
  title: string;
}

const News: React.FC<NewsProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-slate-400">No news articles available.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">{title}</h2>
      <div className="space-y-6">
        {data.map((article, index) => (
          <div key={index} className="p-5 rounded-lg bg-slate-800 border border-slate-700 shadow-lg transition-all duration-300 hover:shadow-violet-500/20 hover:-translate-y-1">
            <h3 className="text-lg font-bold text-violet-400 mb-2">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {article.title}
              </a>
            </h3>
            <div className="flex items-center text-xs text-slate-400 mb-3 space-x-4">
              <span className="font-semibold">{article.source}</span>
              <span className="font-mono">{article.publishedDate}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {article.snippet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;