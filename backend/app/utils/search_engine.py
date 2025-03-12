import re
import logging
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from app.utils.ebook_processor import EbookProcessor
from app.models.book import Book
from app.models.search import Search, SearchResult
from app import db

logger = logging.getLogger(__name__)

# Download NLTK resources if not already downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class SearchEngine:
    """Utility class for searching ebooks."""
    
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
    
    def search(self, query, user_id, max_results=50):
        """Search for books matching the query and save search history."""
        logger.info(f"Searching for '{query}' for user {user_id}")
        
        # Create search record
        search = Search(query=query, user_id=user_id)
        db.session.add(search)
        db.session.flush()  # Get search ID without committing
        
        # Get all books
        books = Book.query.all()
        results = []
        
        for book in books:
            # Extract text from book if not already cached
            text = EbookProcessor.extract_text_from_file(book.file_path)
            
            # Simple search for query in text
            if self._search_text(query, text):
                # Calculate relevance score and context
                relevance, context = self._calculate_relevance(query, text)
                
                # Create search result
                result = SearchResult(
                    search_id=search.id,
                    book_id=book.id,
                    relevance_score=relevance,
                    match_context=context
                )
                
                db.session.add(result)
                results.append((book, relevance, context))
        
        # Sort results by relevance
        results.sort(key=lambda x: x[1], reverse=True)
        
        # Limit results
        results = results[:max_results]
        
        # Commit changes to database
        try:
            db.session.commit()
            logger.info(f"Found {len(results)} results for query '{query}'")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error saving search results: {str(e)}")
        
        return search, results
    
    def get_search_history(self, user_id, limit=10):
        """Get search history for a user."""
        return Search.query.filter_by(user_id=user_id).order_by(Search.timestamp.desc()).limit(limit).all()
    
    def get_search_results(self, search_id):
        """Get results for a specific search."""
        search = Search.query.get(search_id)
        if not search:
            return None, []
        
        results = []
        for result in search.results.order_by(SearchResult.relevance_score.desc()).all():
            book = Book.query.get(result.book_id)
            results.append((book, result.relevance_score, result.match_context))
        
        return search, results
    
    def _search_text(self, query, text):
        """Check if query exists in text."""
        if not text:
            return False
        
        # Simple case-insensitive search
        return query.lower() in text.lower()
    
    def _calculate_relevance(self, query, text, context_size=100):
        """Calculate relevance score and extract context."""
        if not text:
            return 0.0, ""
        
        # Convert to lowercase
        query_lower = query.lower()
        text_lower = text.lower()
        
        # Count occurrences
        count = text_lower.count(query_lower)
        
        # Extract context (text around the first match)
        match_index = text_lower.find(query_lower)
        if match_index >= 0:
            start = max(0, match_index - context_size // 2)
            end = min(len(text), match_index + len(query) + context_size // 2)
            context = text[start:end].strip()
            
            # Highlight the match
            match_start = max(0, match_index - start)
            match_end = match_start + len(query)
            context = context[:match_start] + "**" + context[match_start:match_end] + "**" + context[match_end:]
        else:
            context = ""
        
        # Calculate relevance score (simple version)
        # More sophisticated scoring could be implemented
        relevance = count / max(1, len(text.split()))
        
        return relevance, context 