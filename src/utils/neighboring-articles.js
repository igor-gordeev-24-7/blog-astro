// src/utils/neighboring-articles.js
import { getCollection } from 'astro:content';

export async function getNeighboringArticles(currentSlug) {
  try {
    // Получаем все статьи
    const allArticles = await getCollection('blog');
    
    // Сортируем по дате (от новых к старым)
    const sortedArticles = allArticles.sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
    
    // Находим индекс текущей статьи
    const currentIndex = sortedArticles.findIndex(article => article.slug === currentSlug);
    
    if (currentIndex === -1) {
      return { previous: null, next: null };
    }
    
    // Получаем соседние статьи
    const previousArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null;
    
    return {
      previous: previousArticle,
      next: nextArticle
    };
  } catch (error) {
    console.error('Error getting neighboring articles:', error);
    return { previous: null, next: null };
  }
}