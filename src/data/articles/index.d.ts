/** Type declarations for the articles data module */

export interface ArticleSection {
  heading: string;
  content?: string;
  list?: string[];
}

export interface Article {
  id: number | string;
  title: string;
  subtitle: string;
  category: string;
  heroImage?: string;
  author?: string;
  date: string;
  dateModified?: string;
  readTime: string;
  tags: string[];
  youtubeId?: string;
  sections: ArticleSection[];
  relatedTechniques?: string[];
  relatedArticles?: (number | string)[];
  callToAction?: {
    text: string;
    link: string;
  };
  contentHtml?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

export const articles: Article[];
export const categories: Category[];
export function getArticleById(id: number | string): Article | undefined;
export function getArticlesByCategory(category: string): Article[];
export function getRelatedArticles(articleId: number | string): Article[];
export function getArticlesForTechnique(techniqueId: string): Article[];
